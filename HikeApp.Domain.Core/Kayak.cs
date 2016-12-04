using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace HikeApp.Domain.Core
{
    [Table("Kayak")]
    public class Kayak
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        [Required]
        public int KayakId { get; set; }
        [Required]
        [MaxLength(40)]
        public string Name { get; set; }
        [Required]
        public int CountPlaces { get; set; }
        [Required]
        public int Capacity { get; set; }
        [Required]
        public Decimal Price { get; set; }

        [JsonIgnore]
        public virtual ICollection<Hike> Hikes { get; set; }
    }
}