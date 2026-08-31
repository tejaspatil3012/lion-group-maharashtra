using LionGroup.API.DTOs.Members;

namespace LionGroup.API.Interfaces;

public interface IMemberService
{
    Task<List<MemberDto>> GetAllMembersAsync(string? district = null, int? designationId = null, bool? isCoreLeader = null);
    Task<MemberDto?> GetMemberByIdAsync(int id);
    Task<List<MemberDto>> GetCoreLeadershipAsync();
    Task<List<DesignationDto>> GetAllDesignationsAsync();

    // Admin CRUD Operations
    Task<MemberDto> CreateMemberAsync(CreateMemberDto dto);
    Task<MemberDto?> UpdateMemberAsync(int id, UpdateMemberDto dto);
    Task<bool> DeleteMemberAsync(int id);
    Task<DesignationDto> CreateDesignationAsync(CreateDesignationDto dto);
}
