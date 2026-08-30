namespace LionGroup.API.Models;

public class Designation
{
    public int Id { get; set; }
    public string NameEnglish { get; set; } = string.Empty;
    public string NameMarathi { get; set; } = string.Empty;
    public int DisplayOrder { get; set; } = 0;
    public bool IsCoreLeader { get; set; } = false;

    // Navigation
    public ICollection<Member> Members { get; set; } = new List<Member>();
}
