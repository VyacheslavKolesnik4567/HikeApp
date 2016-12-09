using System;
using System.Collections.Generic;

namespace HikeApp.ViewModels
{
    public class HikeFullDescription
    {
        public int HikeId { get; set; }
        public DateTime DateBegin { get; set; }
        public DateTime DateEnd { get; set; }
        public int PlacesLeft { get; set; }
        public int Places { get; set; }
        public int Difficulty { get; set; }
        public string Head { get; set; }
        public string Kayak { get; set; }
        public string Photo { get; set; }
        public string Description { get; set; }
        public string Path { get; set; }
        public string Price { get; set; }
        public string Name { get; set; }

        public string DateBeginStr { get; set; }
        public string DateEndStr { get; set; }
    }


    public class HomeIndexViewModel
    {
        public List<HikeFullDescription> Hikes { get; set; }
        public int CountHikes { get; set; }
        public bool IsTourist { get; set; }

        public HomeIndexViewModel()
        {
            Hikes = new List<HikeFullDescription>();            
        }
    }
}