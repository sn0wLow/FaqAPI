using System.ComponentModel.DataAnnotations;

namespace FaqAPI.Shared
{
    public class QuestionDTO
    {
        public int Id { get; set; }

        [Required]
        public string Question { get; set; }

        [Required]
        public string Answer { get; set; }

        public IEnumerable<string>? Tags { get; set; }

    }
}
