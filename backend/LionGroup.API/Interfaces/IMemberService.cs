using LionGroup.API.DTOs.Members;

namespace LionGroup.API.Interfaces;

public interface IMemberService
{
    Task<List<MemberDto>> GetAllMembersAsync(string? district = null, int? designationId = null, bool? isCoreLeader = null);
    Task<MemberDto?> GetMemberByIdAsync(int id);
    Task<List<MemberDto>> GetCoreLeadershipAsync();
    Task<List<DesignationDto>> GetAllDesignationsAsync();
}
