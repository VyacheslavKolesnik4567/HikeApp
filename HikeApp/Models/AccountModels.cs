using System.ComponentModel.DataAnnotations;

namespace HikeApp.ViewModels
{
    public class RegisterExternalLoginModel
    {
        [Required]
        [Display(Name = "Имя пользователя")]
        public string UserName { get; set; }

        public string ExternalLoginData { get; set; }
    }

    public class LocalPasswordModel
    {
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Текущий пароль")]
        public string OldPassword { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Значение \"{0}\" должно содержать не менее {2} символов.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Новый пароль")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Подтверждение пароля")]
        [Compare("NewPassword", ErrorMessage = "Новый пароль и его подтверждение не совпадают.")]
        public string ConfirmPassword { get; set; }
    }

    public class LoginModel
    {
        [Required]
        [Display(Name = "Имя пользователя")]
        public string UserName { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Пароль")]
        public string Password { get; set; }

        [Display(Name = "Запомнить меня")]
        public bool RememberMe { get; set; }
    }

    public class RegisterModel
    {
        [Required]
        [StringLength(100, ErrorMessage = "Введите имя пользователя")]
        [Display(Name = "Имя пользователя*")]
        public string UserName { get; set; }
        [StringLength(100, ErrorMessage = "Введите имя")]
        [Display(Name = "Имя")]
        [RegularExpression(@"[А-Яа-яA-Za-z]{2,}")]
        public string FirstName { get; set; }
        [StringLength(100, ErrorMessage = "Введите фамилию")]
        [Display(Name = "Фамилия")]
        [RegularExpression(@"[А-Яа-яA-Za-z]{2,}")]
        public string LastName { get; set; }
        [StringLength(100, ErrorMessage = "Введите дату рождения")]
        [Display(Name = "Дата рождения")]
        [RegularExpression(@"^\d{1,2}\.\d{1,2}\.\d{4}$")]
        public string Birthday { get; set; }
        [Display(Name = "Пол")]
        public string Gender { get; set; }
        [Display(Name = "Телефон")]
        [RegularExpression(@"^[0]{1}[0-9]{9}$")]
        [StringLength(100, ErrorMessage = "Введите телефон")]
        public string Phone { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Значение \"{0}\" должно содержать не менее {2} символов.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Пароль*")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Подтверждение пароля*")]
        [Compare("Password", ErrorMessage = "Пароль и его подтверждение не совпадают.")]
        public string ConfirmPassword { get; set; }
    }

    public class ExternalLogin
    {
        public string Provider { get; set; }
        public string ProviderDisplayName { get; set; }
        public string ProviderUserId { get; set; }
    }
}