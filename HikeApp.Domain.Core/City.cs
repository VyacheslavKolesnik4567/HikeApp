using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HikeApp.Domain.Core
{
    [Table("City")]
    public class City
    {
        public int CityId { get; set; }
        [Required]
        [MaxLength(50)]
        public string CityName { get; set; }
    }
}