using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HikeApp.Core;
using HikeApp.Domain.Core;
using System.Text.RegularExpressions;
using System.IO;
using HikeApp.Filters;
using HikeApp.Domain.Interfaces;

namespace HikeApp.Controllers
{
    [Authorize]
    [InitializeSimpleMembership]
    public class AdminController : Controller
    {
        IUnitOfWork db;

        public AdminController(IUnitOfWork unitOfWork)
        {
            db = unitOfWork;
        }

    [Authorize(Roles = "Admin")]
        public ActionResult Index()
        {
            try
            {
                return View();
            }
            catch (Exception ex)
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.ExpectationFailed, ex.Message);
            }
        }

        //=================================================//
        //==============Hikes grid methods=================//
        //=================================================//
        public string GetHikes()
        {
            try
            {
                List<object> jsonHikes = new List<object>();
                var hikes = db.Hikes.GetHikesList();
                foreach (var i in hikes)
                {
                    var hikeTourists = db.HikeTourists.GetHikeTouristsList()
                        .Where(x => x.HikeId == i.HikeId);

                    jsonHikes.Add(new
                    {
                        Id = i.HikeId,
                        DateStart = i.DateBegin.ToShortDateString(),
                        DateEnd = i.DateEnd.ToShortDateString(),
                        Difficulty = i.Difficulty,
                        HeadId = i.HeadId,
                        KayakId = i.KayakId,
                        CountKayak = i.CountKayak,
                        PathId = i.PathId,
                        CountTourists = hikeTourists.Count()
                    }
                    );
                }

                return jsonHikes.ToJson();
            }
            catch
            {
                return "";
            }
        }

        public void EditHike(int Id, int HeadId, int KayakId, int PathId, 
            int CountKayak, DateTime DateStart, DateTime DateEnd, int Difficulty)
        {
            try
            {
                db.Hikes.Update(new Hike() {
                    HikeId = Id,
                    HeadId = HeadId,
                    KayakId = KayakId,
                    PathId = PathId,
                    CountKayak = CountKayak,
                    DateBegin = DateStart,
                    DateEnd = DateEnd,
                    Difficulty = Difficulty,
                });

                db.Save();
            }
            catch { }
        }

        public void AddHike(int HeadId, int KayakId, int PathId, 
            int CountKayak, DateTime DateStart, DateTime DateEnd, int Difficulty)
        {
            try
            {
                db.Hikes.Create(new Hike()
                {
                    HeadId = HeadId,
                    KayakId = KayakId,
                    PathId = PathId,
                    CountKayak = CountKayak,
                    DateBegin = DateStart,
                    DateEnd = DateEnd,
                    Difficulty = Difficulty,
                });

                db.Save();
            }
            catch { }
        }

        public void DeleteHike(int hikeId)
        {
            try
            {
                db.Hikes.Delete(hikeId);
                db.Save();
            }
            catch { }
        }

        //=================================================//
        //=========HikeTourists subgrid methods=============//
        //=================================================//
        public string GetTouristsByHikeId(int hikeId)
        {
            try
            {
                var hikeTourists = db.HikeTourists.GetHikeTouristsList()
                    .Where(x=>x.HikeId == hikeId);
                List<object> touristsInfoList = new List<object>();
                foreach (var i in hikeTourists)
                {
                    var tourist = db.Tourists.GetTourist(i.TouristId);

                    touristsInfoList.Add(new
                    {
                        Id = i.HikeTouristId,
                        TouristId = tourist.TouristFirstName + " " + tourist.TouristLastName,
                        HikeId = i.HikeId,
                        Birthday = tourist.Birthday.ToShortDateString(),
                        KayakNumber = i.KayakNumber,
                        PlaceNumber = i.PlaceNumber,
                        Confirmed = i.Confirmed,
                        Phone = tourist.Phone
                    }
                    );
                }

                return touristsInfoList.ToJson();
            }
            catch
            {
                return "";
            }
        }

        public void DeleteTouristHike(int hikeTouristId)
        {
            try
            {
                db.HikeTourists.Delete(hikeTouristId);
                db.Save();
            }
            catch { }
        }

        public void AddHikeTourist(int hikeId, int touristId, int kayakNumber, int placeNumber, string confirmed)
        {
            try
            {
                bool confirm;
                if (bool.TryParse(confirmed, out confirm))
                {
                    db.HikeTourists.Create(new HikeTourist()
                    {
                        HikeId = hikeId,
                        TouristId = touristId,
                        KayakNumber = kayakNumber,
                        PlaceNumber = placeNumber,
                        Confirmed = confirm
                    });
                    db.Save();
                }
            }
            catch { }
        }

        public void EditHikeTourist(int Id, int TouristId, int KayakNumber, int PlaceNumber, bool Confirmed)
        {
            try
            {
                db.HikeTourists.Update(new HikeTourist() {
                    HikeTouristId = Id,
                    KayakNumber = KayakNumber,
                    PlaceNumber = PlaceNumber,
                    Confirmed = Confirmed,
                    TouristId = TouristId            
                });
                db.Save();

            }
            catch { }
        }

        public string GetTouristList()
        {
            try
            {
                return db.Tourists.GetTouristsList()
                    .ToDictionary(x => x.TouristId, y => y.TouristFirstName + " " + y.TouristLastName).ToJson();
            }
            catch 
            {
                return "";
            }
        }

        public int GetHikeKayakCount(int hikeId)
        {
            try
            {
                return db.Hikes.GetHike(hikeId).CountKayak;
            }
            catch 
            {
                return 0;
            }
        }

        public int GetKayakCountPlacesForHike(int hikeId)
        {
            try
            {
                var kayak = db.Kayaks.GetKayak(db.Hikes.GetHike(hikeId).KayakId);
                return kayak.CountPlaces;
            }
            catch
            {
                return 0;
            }
        }

        //=================================================//
        //=================Tourist grid methods=============//
        //=================================================//
        public string GetTourists()
        {
            try
            {
                var tourists = db.Tourists.GetTouristsList();

                List<object> touristsInfoList = new List<object>();
                foreach (var i in tourists)
                {
                    string gender = "";
                    if (i.Gender == "male")
                        gender = "Мужской";
                    else
                        gender = "Женский";
                    touristsInfoList.Add(new
                    {
                        Id = i.TouristId,
                        FirstName = i.TouristFirstName,
                        LastName = i.TouristLastName,
                        Birthday = i.Birthday.ToShortDateString(),
                        Gender = gender,
                        Phone = i.Phone,
                        Registered = db.UserProfiles.GetUserProfilesList()
                            .Count(x => x.TouristId == i.TouristId) != 0 ? true : false
                    });
                }

                return touristsInfoList.ToJson();
            }
            catch
            {
                return "";
            }
        }

        public void DeleteTourist(int touristId)
        {
            try
            {
                db.Tourists.Delete(touristId);
                db.Save();
            }
            catch
            { }
        }

        public void AddTourist(string FirstName, string LastName, DateTime Birthday, string Gender, string Phone)
        {
            try
            {
                db.Tourists.Create(new Tourist()
                {
                    TouristFirstName = FirstName,
                    TouristLastName = LastName,
                    Birthday = Birthday,
                    Gender = Gender,
                    Phone = Phone
                });
                db.Save();
            }
            catch { }
        }

        public void EditTourist(int Id, string FirstName, string LastName, DateTime Birthday, string Gender, string Phone)
        {
            try
            {
                db.Tourists.Update(new Tourist()
                {
                    TouristId = Id,
                    TouristFirstName = FirstName,
                    TouristLastName = LastName,
                    Birthday = Birthday,
                    Gender = Gender,
                    Phone = Phone
                });
                db.Save();
            }
            catch { }
        }

        //=================================================//
        //=================Path grid methods===============//
        //=================================================//
        public string GetWays()
        {
            try
            {
                var paths = db.Paths.GetPathsList();
                var pathsObj = new List<object>();
                foreach (var i in paths)
                    pathsObj.Add(new
                    {
                        Id = i.PathId,
                        WayName = i.WayName,
                        Way = i.Way,
                        Price = i.WayPrice.ToString(),
                        Description = i.WayDescription
                    });
                
                return pathsObj.ToJson();
            }
            catch
            {
                return "";
            }
        }

        public void AddPath(string WayName, string Way, decimal Price, string Description)
        {
            try
            {
                db.Paths.Create(new Domain.Core.Path()
                {
                    WayName = WayName,
                    Way = Way,
                    WayPrice = Price,
                    WayDescription = Description
                });
                db.Save();
            }
            catch { }
        }

        public void EditPath(int Id, string WayName, string Way, decimal Price, string Description)
        {
            try
            {
                db.Paths.Update(new Domain.Core.Path()
                {
                    PathId = Id,
                    WayName = WayName,
                    Way = Way,
                    WayPrice = Price,
                    WayDescription = Description
                });
                db.Save();
            }
            catch { }
        }

        public void DeletePath(int pathId)
        {
            try
            {
                db.Paths.Delete(pathId);
                db.Save();
            }
            catch { }
        }

        //=================================================//
        //=================Cities methods==================//
        //=================================================//
        public string GetCities()
        {
            try
            {
                return db.Cities.GetCitiesList().ToJson();
            }
            catch
            {
                return "";
            }
        }

        public void SaveCity(string name)
        {
            try
            {
                db.Cities.Create(new City() { CityName = name });
                db.Save();
            }
            catch { }
        }

        public void EditCity(int id, string name)
        {
            try
            {
                db.Cities.Update(new City() {
                    CityId = id,
                    CityName = name
                });
                db.Save();
            }
            catch { }
        }

        public void DelCity(int cityId)
        {
            try
            {
                db.Cities.Delete(cityId);
                db.Save();
            }
            catch { }
        }

        //=================================================//
        //=================Heads grid methods==============//
        //=================================================//
        public string GetHeads()
        {
            try
            {
                List<object> heads = new List<object>();
                foreach (var i in db.Heads.GetHeadsList())
                {
                    heads.Add(new
                    {
                        Id = i.HeadId,
                        FirstName = i.HeadFirstName,
                        LastName = i.HeadLastName,
                        Birthday = i.Birthday.ToShortDateString()
                    });
                }

                return heads.ToJson();
            }
            catch
            {
                return "";
            }
        }

        public void AddHead(string FirstName, string LastName, DateTime Birthday)
        {
            try
            {
                db.Heads.Create(new Head() {
                    HeadFirstName = FirstName,
                    HeadLastName = LastName,
                    Birthday = Birthday
                });
                db.Save();
            }
            catch { }
        }

        public void EditHead(int Id, string FirstName, string LastName, DateTime Birthday)
        {
            try
            {
                db.Heads.Update(new Head()
                {
                    HeadId = Id,
                    HeadFirstName = FirstName,
                    HeadLastName = LastName,
                    Birthday = Birthday
                });
                db.Save();
            }
            catch { }
        }

        public void DeleteHead(int headId)
        {
            try
            {
                db.Heads.Delete(headId);
                db.Save();
            }
            catch { }
        }

        //=================================================//
        //=================Kayaks grid methods=============//
        //=================================================//
        public string GetKayaks()
        {
            try
            {
                var kayaksJson = new List<object>();
                foreach (var i in db.Kayaks.GetKayaksList())
                {
                    kayaksJson.Add(new
                    {
                        Id = i.KayakId,
                        Name = i.Name,
                        CountPlaces = i.CountPlaces,
                        Capacity = i.Capacity,
                        Price = i.Price.ToString()
                    });
                }

                return kayaksJson.ToJson();
            }
            catch
            {
                return "";
            }
        }

        public void AddKayak(string Name, int CountPlaces, int Capacity, decimal Price)
        {
            try
            {
                db.Kayaks.Create(new Kayak()
                {
                    Name = Name,
                    CountPlaces = CountPlaces,
                    Capacity = Capacity,
                    Price = Price
                });
                db.Save();
            }
            catch { }
        }

        public void EditKayak(int Id, string Name, int CountPlaces, int Capacity, decimal Price)
        {
            try
            {
                db.Kayaks.Update(new Kayak()
                {
                    KayakId = Id,
                    Name = Name,
                    CountPlaces = CountPlaces,
                    Capacity = Capacity,
                    Price = Price
                });
                db.Save();
            }
            catch { }
        }

        public void DeleteKayak(int kayakId)
        {
            try
            {
                db.Kayaks.Delete(kayakId);
                db.Save();
            }
            catch { }
        }

        //=================================================//
        //=================HikePhoto methods===============//
        //=================================================//
        public string GetHikePhotos(int hikeId)
        {
            try
            {
                return new
                {
                    hikePhotosLocation = db.HikePhotos.GetHikePhotosList()
                        .Where(x=>x.HikeId == hikeId).ToJson(),
                    hikePath = db.Paths.GetPath(db.Hikes.GetHike(hikeId).PathId).Way
                }.ToJson();
            }
            catch
            {
                return "";
            }
        }

        public string GetAllPhotos(string directoryName)
        {
            try
            {
                List<string> images = new List<string>();
                Regex reg = new Regex(@"[\w\-]*\.[a-z,A-Z]{3,4}$");
                foreach (var s in Directory.GetFiles(HttpRuntime.AppDomainAppPath + "\\Images\\HikesPhotos\\" + directoryName))
                {
                    if (reg.Match(s).Value != "none.png" && reg.Match(s).Value != "dir.png")
                        images.Add(reg.Match(s).Value);
                }
                return images.ToJson();
            }
            catch
            {
                return "";
            }
        }

        public string GetAllDirectories()
        {
            try
            {
                List<string> directories = new List<string>();
                DirectoryInfo dir = new DirectoryInfo(HttpRuntime.AppDomainAppPath + "\\Images\\HikesPhotos");

                foreach (var i in dir.GetDirectories())
                {
                    directories.Add(i.Name);
                }

                return directories.ToJson();
            }
            catch
            {
                return "";
            }
        }

        public void AddHikePhoto(int hikeId, string photoLocation)
        {
            try
            {
                db.HikePhotos.Create(new HikePhoto()
                {
                    HikeId = hikeId,
                    Location = photoLocation
                });
                db.Save();
            }
            catch { }
        }

        public void DeleteHikePhoto(int photoId)
        {
            try
            {
                db.HikePhotos.Delete(photoId);
                db.Save();
            }
            catch { }
        }

        //=================================================//
        //=================Analysis methods===============//
        //=================================================//
        public string TouristsActivityByMounths()
        {
            try
            {
                Dictionary<int, int> activity = new Dictionary<int, int>();
                for (int i = 1; i < 13; i++)
                {
                    int count = db.HikeTourists.GetHikeTouristsList()
                        .Count(x=> {
                            var hike = db.Hikes.GetHike(x.HikeId);
                            if (hike.DateBegin.Month == i || hike.DateEnd.Month == i)
                                return true;
                            else
                                return false;
                        });

                    activity.Add(i, count);
                }

                return activity.ToJson();
            }
            catch 
            {
                return "";
            }
        }

        public string HikesLength()
        {
            try
            {
                List<int> list = new List<int>();
                var hikes = db.Hikes.GetHikesList()
                    .Select(x => new { dateB = x.DateBegin, dateE = x.DateEnd });
                foreach (var i in hikes)
                    list.Add((i.dateE - i.dateB).Days);

                return list.GroupBy(x => x).ToDictionary(x => x.Key, y => y.Count()).ToJson(); ;
            }
            catch
            {
                return "";
            }
        }

        public string GetTouristsStrength()
        {
            try
            {
                List<int> touristsStrength = new List<int>();
                var tourists = db.Tourists.GetTouristsList()
                    .Select(x => x.Birthday);

                foreach (var i in tourists)
                    touristsStrength.Add((DateTime.Now - i).Days / 365);

                return touristsStrength.ToJson();
            }
            catch
            {
                return "";
            }
        }

        public string GetHeadsHikes()
        {
            try
            {
                List<object> headsHikes = new List<object>();
                //Get all hike's heads
                foreach (var i in db.Heads.GetHeadsList())
                {
                    List<object> hikes = new List<object>();
                    //Get head's hikes
                    var headHikes = db.Hikes.GetHikesList().Where(x => x.HeadId == i.HeadId);

                    //Seed head's hikes info list
                    foreach (var k in headHikes)
                    {

                        List<object> hikeTouristsInfoList = new List<object>();
                        //Get hike's tourist list
                        var hikeTouristsList = db.HikeTourists.GetHikeTouristsList()
                            .Where(x => x.HikeId == k.HikeId);

                        //Seed hike's tourist info list for current hike
                        foreach (var l in hikeTouristsList)
                        {
                            var tourist = db.Tourists.GetTourist(l.TouristId);
                     
                            hikeTouristsInfoList.Add(new
                            {
                                touristName = tourist.TouristFirstName + " " + tourist.TouristLastName,
                                birthday = tourist.Birthday.ToShortDateString(),
                                phone = tourist.Phone
                            });
                        }

                        //Get current hike's path
                        var path = db.Paths.GetPath(k.PathId);

                        //Seed current head's hikes info list
                        hikes.Add(new
                        {
                            headName = i.HeadFirstName + " " + i.HeadLastName,
                            hikeId = k.HikeId,
                            kayakName = db.Kayaks.GetKayak(k.KayakId).Name,
                            way = path.Way,
                            difficulty = k.Difficulty,
                            dateBegin = k.DateBegin.ToShortDateString(),
                            dateEnd = k.DateEnd.ToShortDateString(),
                            price = path.WayPrice.ToString(),
                            tourists = hikeTouristsInfoList
                        });
                    }

                    headsHikes.Add(new
                    {
                        headId = i.HeadId,
                        hikes = hikes
                    });
                }

                return headsHikes.ToJson();
            }
            catch
            {
                return "";
            }
        }

        public string GetHeadHikes(int headId)
        {
            try
            {
                List<object> hikes = new List<object>();
                //Get head's hikes
                var headHikes = db.Hikes.GetHikesList().Where(x => x.HeadId == headId);

                //Seed head's hikes info list
                foreach (var k in headHikes)
                {
                    var head = db.Heads.GetHead(headId);
                    List<object> hikeTouristsListObj = new List<object>();
                    //Get hike's tourist list
                    var hikeTourists = db.HikeTourists.GetHikeTouristsList().Where(x => x.HikeId == k.HikeId);
                    
                    //Seed hike's tourist info list for current hike
                    foreach (var l in hikeTourists)
                    {
                        var tourist = db.Tourists.GetTourist(l.TouristId);

                        hikeTouristsListObj.Add(new
                        {
                            touristName = tourist.TouristFirstName + " " + tourist.TouristLastName,
                            birthday = tourist.Birthday.ToShortDateString(),
                            phone = tourist.Phone
                        });
                    }

                    //Get current hike's path
                    var path = db.Paths.GetPath(k.PathId);
                    //Seed head's hikes info list
                    hikes.Add(new
                    {
                        headName = head.HeadFirstName + " " + head.HeadLastName,
                        hikeId = k.HikeId,
                        kayakName = db.Kayaks.GetKayak(k.KayakId).Name,
                        way = path.Way,
                        difficulty = k.Difficulty,
                        dateBegin = k.DateBegin.ToShortDateString(),
                        dateEnd = k.DateEnd.ToShortDateString(),
                        price = path.WayPrice.ToString(),
                        tourists = hikeTouristsListObj
                    });
                }

                return new { hikes = hikes }.ToJson();
            }
            catch
            {
                return "";
            }
        }

        public PartialViewResult HeadHikesPrint()
        {
            return PartialView("HeadHikesPrint");
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}
