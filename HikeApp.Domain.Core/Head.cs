using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HikeApp.Domain.Core
{
    [Table("Head")]
    public class Head
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        [Required]
        public int HeadId { get; set; }
        [Required]
        [MaxLength(25)]
        public string HeadFirstName { get; set; }
        [Required]
        [MaxLength(25)]
        public string HeadLastName { get; set; }
        [Required]
        [DisplayFormat(DataFormatString = "{dd.MM.yyyy}", ApplyFormatInEditMode = true)]
        public DateTime Birthday { get; set; }

        public virtual ICollection<Hike> Hikes { get; set; }
    }
}