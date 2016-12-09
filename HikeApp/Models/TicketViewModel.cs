using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HikeApp.ViewModels
{
    public class TicketViewModel
    {
        public string TuristFullName { get; set; }
        public DateTime DateStart { get; set; }
        public DateTime DateEnd { get; set; }
        public string HeadFullName { get; set; }
        public int Difficulty { get; set; }
        public string Path { get; set; }
        public string Kayak { get; set; }
    }
}