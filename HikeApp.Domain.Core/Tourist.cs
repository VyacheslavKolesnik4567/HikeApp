using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HikeApp.Domain.Core
{
    [Table("Tourist")]
    public class Tourist
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        [Required]
        public int TouristId { get; set; }
        [Required]
        [MaxLength(25)]
        public string TouristFirstName { get; set; }
        [Required]
        [MaxLength(25)]
        public string TouristLastName { get; set; }
        [Required]
        [MaxLength(25)]
        public string Phone { get; set; }
        [Required]
        [MaxLength(6)]
        public string Gender { get; set; }
        [Required]
        [DisplayFormat(DataFormatString = "{dd.MM.yyyy}", ApplyFormatInEditMode = true)]
        public DateTime Birthday { get; set; }

        public virtual ICollection<HikeTourist> HikeTourists { get; set; }
    }
}