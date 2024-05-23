using System.ComponentModel.DataAnnotations;

namespace Api.Dtos
{
    public class TodoDto
    {
        [Range(1, 3, ErrorMessage = "Priority must be between 1 and 3.")]
        public int Priority { get; set; }
        public int Id { get; set; }
        public string Title { get; set; }
        public bool Completed { get; set; }
        public int UserId { get; set; }
    }
}
