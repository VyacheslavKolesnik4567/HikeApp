using HikeApp.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using HikeApp.Core;
using WebMatrix.WebData;
using HikeApp.Filters;
using HikeApp.Domain.Core;
using HikeApp.Domain.Interfaces;

namespace HikeApp.Controllers
{
    [InitializeSimpleMembership]
    public class HomeController : Controller
    {
        IUnitOfWork db;

        public HomeController(IUnitOfWork unitOfWork)
        {
            db = unitOfWork;
        }

        public ActionResult Index()
        {
            try
            {
                var hikesList = db.Hikes.GetHikesList();

                HomeIndexViewModel model = new HomeIndexViewModel();
                //Set future hikes count
                model.CountHikes = hikesList.Count(x => x.DateBegin > DateTime.Now);

                foreach (var i in hikesList.Take(2))
                {
                    //Get hike's kayak
                    var kayak = db.Kayaks.GetKayak(i.KayakId);
                    //Get hike's head
                    var head = db.Heads.GetHead(i.HeadId);
                    //Get hike's first photo
                    var photo = db.HikePhotos.GetHikePhotosList().FirstOrDefault(x => x.HikeId == i.HikeId);
                    //Get hike's path
                    var path = db.Paths.GetPath(i.PathId);
                    HikeFullDescription hikeFullDesc = new HikeFullDescription();
                    hikeFullDesc.HikeId = i.HikeId;
                    hikeFullDesc.Places = kayak.CountPlaces * i.CountKayak;
                    hikeFullDesc.PlacesLeft = hikeFullDesc.Places - db.HikeTourists.GetHikeTouristsList().Count(x=>x.HikeId == i.HikeId);
                    hikeFullDesc.DateBegin = i.DateBegin;
                    hikeFullDesc.DateEnd = i.DateEnd;
                    hikeFullDesc.Difficulty = i.Difficulty;
                    hikeFullDesc.Head = head.HeadFirstName + " " + head.HeadLastName;
                    hikeFullDesc.Kayak = kayak.Name;
                    hikeFullDesc.Photo = photo.Location;

                    if (path != null)
                    {
                        hikeFullDesc.Description = path.WayDescription;
                        hikeFullDesc.Path = path.Way;
                        hikeFullDesc.Price = path.WayPrice.ToString();
                        hikeFullDesc.Name = path.WayName;
                    }
                    
                    model.Hikes.Add(hikeFullDesc);
                }

                if (WebSecurity.IsAuthenticated)
                {
                    var currentUser = db.UserProfiles.GetUserProfile(WebSecurity.CurrentUserId);
                    model.IsTourist = currentUser.TouristId != null ? true : false;
                }
                else
                    model.IsTourist = false;

                return View(model);
            }
            catch(Exception ex)
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.ExpectationFailed, ex.Message);
            }
        }

        //Get specific hikes
        public string GetHikes(int skip, int take)
        {
            try
            {
                List<HikeFullDescription> hikes = new List<HikeFullDescription>();
                var hikeList = db.Hikes.GetHikesList();
                var futureHikeList = hikeList.Where(x => x.DateBegin > DateTime.Now)
                    .Skip(skip).Take(take);

                foreach (var i in futureHikeList)
                {
                    //Get hike's kayak
                    var kayak = db.Kayaks.GetKayak(i.KayakId);
                    //Get hike's head
                    var head = db.Heads.GetHead(i.HeadId);
                    //Get hike's first photo
                    var photo = db.HikePhotos.GetHikePhotosList().FirstOrDefault(x => x.HikeId == i.HikeId);
                    //Get hike's all tourist
                    var hikeTourist = db.HikeTourists.GetHikeTouristsList().Where(x => x.HikeId == i.HikeId);
                    //Get hike's path
                    var hikePath = db.Paths.GetPath(i.PathId);

                    HikeFullDescription hikeFullDesc = new HikeFullDescription();
                    hikeFullDesc.HikeId = i.HikeId;
                    hikeFullDesc.Places = kayak.CountPlaces * i.CountKayak;
                    hikeFullDesc.PlacesLeft = hikeFullDesc.Places - hikeTourist.Count();
                    hikeFullDesc.DateBegin = i.DateBegin;
                    hikeFullDesc.DateEnd = i.DateEnd;
                    hikeFullDesc.Difficulty = i.Difficulty;
                    hikeFullDesc.Head = head.HeadFirstName + " " + head.HeadLastName;
                    hikeFullDesc.Kayak = kayak.Name;
                    hikeFullDesc.Photo = photo.Location;

                    if (hikePath != null)
                    {
                        hikeFullDesc.Description = hikePath.WayDescription;
                        hikeFullDesc.Path = hikePath.Way;
                        hikeFullDesc.Price = hikePath.WayPrice.ToString();
                        hikeFullDesc.Name = hikePath.WayName;
                    }                                        

                    hikes.Add(hikeFullDesc);
                }

                //Return requested hikes and total hikes count
                return new {
                    hikes = hikes,
                    hikesCount = hikeList.Count(x => x.DateBegin > DateTime.Now)
                }.ToJson();
            }
            catch
            {
                return "";
            }
        }

        public string GetHikeInfo(int hikeId)
        {
            try
            {
                object hikeInfo = new object();

                var hike = db.Hikes.GetHike(hikeId);
                //Get hike's head
                var head = db.Heads.GetHead(hike.HeadId);
                //Get hike's path
                var path = db.Paths.GetPath(hike.PathId);
                //Get hike's kayak
                var kayak = db.Kayaks.GetKayak(hike.KayakId);

                hikeInfo = new
                {
                    DateStart = hike.DateBegin.ToShortDateString(),
                    DateEnd = hike.DateEnd.ToShortDateString(),
                    HeadFullName = head.HeadFirstName + " " + head.HeadLastName,
                    Difficulty = hike.Difficulty,
                    Path = path.Way,
                    Kayak = kayak.Name
                };

                return hikeInfo.ToJson();
            }
            catch
            {
                return "";
            }
        }

        public string GetKayaksInfoForHike(int hikeId)
        {
            try
            {
                var hike = db.Hikes.GetHike(hikeId);
                //Get hike's kayak
                var kayak = db.Kayaks.GetKayak(hike.KayakId);
            
                //Return hike's kayak info
                return (new
                    {
                        kayakCountPlaces = kayak.CountPlaces,
                        kayaksCount = hike.CountKayak,
                        kayakName = kayak.Name
                    }).ToJson();
            }
            catch
            {
                return "";
            }
        }

        public string GetHikeTouristsInfo(int hikeId)
        {
            try
            {
                //Get all hike tourists
                var hikeTourists = db.HikeTourists.GetHikeTouristsList().Where(x=>x.HikeId == hikeId);

                //Confirmed tourists info list
                List<object> touristsInfo = new List<object>();

                //Add confirmed tourists info to list
                foreach (var i in hikeTourists)
                {
                    if (i.Confirmed)
                    {
                        var tourist = db.Tourists.GetTourist(i.TouristId);

                        touristsInfo.Add(new
                        {
                            TouristName = tourist.TouristFirstName,
                            TouristStrength = (DateTime.Now - tourist.Birthday).Days / 365,
                            KayakNumber = i.KayakNumber,
                            PlaceNumber = i.PlaceNumber,
                            Gender = tourist.Gender
                        });
                    }
                }

                return touristsInfo.ToJson();
            }
            catch
            {
                return "";
            }
        }

        public string RegTouristToHike(int hikeId, string lastName, string firstName, DateTime birthday, int kayakNum, int placeNum, string gender, string phone)
        {
            try
            {
                //If user doesn't registered
                if (!WebSecurity.IsAuthenticated)
                {
                    db.Tourists.Create(new Tourist()
                    {
                        TouristFirstName = firstName,
                        TouristLastName = lastName,
                        Birthday = birthday,
                        Gender = gender,
                        Phone = phone
                    });

                    //Find user's touristID
                    int touristId = db.Tourists.GetTouristsList()
                        .Where(x => x.TouristFirstName == firstName && x.TouristLastName == lastName)
                        .FirstOrDefault().TouristId;

                    //Add new tourist to hike
                    db.HikeTourists.Create(new HikeTourist()
                    {
                        HikeId = hikeId,
                        TouristId = touristId,
                        KayakNumber = kayakNum,
                        PlaceNumber = placeNum,
                        Confirmed = false
                    });

                    //Return tourist place
                    return new { kayak = kayakNum, place = placeNum }.ToJson();
                }
                else
                {
                    //Try to find user's tourist id 
                    UserProfile currentUser = db.UserProfiles.GetUserProfile(WebSecurity.CurrentUserId);
                    int? touristId = currentUser.TouristId;

                    if (touristId != null)
                    {
                        //Add new tourist to hike
                        db.HikeTourists.Create(new HikeTourist()
                        {
                            HikeId = hikeId,
                            TouristId = (int)touristId,
                            KayakNumber = kayakNum,
                            PlaceNumber = placeNum,
                            Confirmed = false
                        });

                        //Return tourist place
                        return new { kayak = kayakNum, place = placeNum }.ToJson();
                    }
                    //If did not find
                    else
                    {
                        //Create new tourist
                        db.Tourists.Create(new Tourist()
                        {
                            TouristFirstName = firstName,
                            TouristLastName = lastName,
                            Birthday = birthday,
                            Gender = gender,
                            Phone = phone
                        });

                        //Get new tourist ID
                        int newTouristId = db.Tourists.GetTouristsList()
                            .Where(x => x.TouristFirstName == firstName && x.TouristLastName == lastName)
                            .FirstOrDefault().TouristId;

                        //Set current user tourist ID 

                        var user = db.UserProfiles.GetUserProfile(WebSecurity.CurrentUserId);
                        user.UserId = newTouristId;
                        db.UserProfiles.Update(user);
                        db.Save();

                        //Add new tourist to hike
                        db.HikeTourists.Create(new HikeTourist()
                        {
                            HikeId = hikeId,
                            TouristId = newTouristId,
                            KayakNumber = kayakNum,
                            PlaceNumber = placeNum,
                            Confirmed = false
                        });

                        //Return tourist place
                        return new { kayak = kayakNum, place = placeNum }.ToJson();
                    }
                }
            }
            catch
            {
                return "";
            }
        }

        public void AddTourist(string lastName, string firstName, DateTime birthday, string gender, string phone)
        {
            try
            {
                //Create new tourist
                db.Tourists.Create(new Tourist()
                {
                    TouristFirstName = firstName,
                    TouristLastName = lastName,
                    Birthday = birthday,
                    Gender = gender,
                    Phone = phone
                });
            }
            catch
            {
            }
        }

        public PartialViewResult ShowTicket()
        {
            return PartialView("Ticket");
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }  
}
