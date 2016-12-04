using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace HikeApp.Domain.Core
{
    [Table("Path")]
    public class Path
    {
        [Key]
        [Required]
        public int PathId { get; set; }
        [Required]
        [MaxLength(50)]
        public string WayName { get; set; }
        [Required]
        [MaxLength(200)]
        public string Way { get; set; }
        [Required]
        public Decimal WayPrice { get; set; }
        public string WayDescription { get; set; }

        [JsonIgnore]
        public virtual ICollection<Hike> Hikes { get; set; }
    }
}