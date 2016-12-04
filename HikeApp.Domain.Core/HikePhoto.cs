using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HikeApp.Domain.Core
{
    [Table("HikePhoto")]
    public class HikePhoto
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        [Required]
        public int PhotoId { get; set; }
        [Required]
        public int HikeId { get; set; }
        [Required]
        public string Location { get; set; }

        public virtual Hike Hike { get; set; }
    }
}