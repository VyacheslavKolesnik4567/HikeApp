using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HikeApp.Domain.Core
{
    [Table("Hike")]
    public class Hike
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        [Required]
        public int HikeId { get; set; }
        [Required]
        [DisplayFormat(DataFormatString = "{dd.MM.yyyy}", ApplyFormatInEditMode = true)]
        public DateTime DateBegin { get; set; }
        [Required]
        [DisplayFormat(DataFormatString = "{dd.MM.yyyy}", ApplyFormatInEditMode = true)]
        public DateTime DateEnd { get; set; }
        [Required]
        public int CountKayak { get; set; }
        [Required]
        public int Difficulty { get; set; }
        [Required]
        public int HeadId { get; set; }
        [Required]
        public int KayakId { get; set; }
        [Required]
        public int PathId { get; set; }

        public virtual Path Path { get; set; }

        public virtual Kayak Kayak { get; set; }

        public virtual Head Head { get; set; }

        public virtual ICollection<HikeTourist> HikeTourist { get; set; }

        public virtual ICollection<HikePhoto> HikePhotos { get; set; }
    }
}