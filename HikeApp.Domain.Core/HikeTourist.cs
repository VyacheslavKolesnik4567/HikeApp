using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HikeApp.Domain.Core
{
    [Table("HikeTourist")]
    public class HikeTourist
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        [Required]
        public int HikeTouristId { get; set; }
        [Required]
        public int HikeId { get; set; }
        [Required]
        public int TouristId { get; set; }
        public int KayakNumber { get; set; }
        public int PlaceNumber { get; set; }
        public bool Confirmed { get; set; }

        public virtual Hike Hike { get; set; }
        public virtual Tourist Tourist { get; set; }
    }
}