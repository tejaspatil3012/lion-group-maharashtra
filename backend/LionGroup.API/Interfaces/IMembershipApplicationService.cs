using LionGroup.API.DTOs.Membership;
using LionGroup.API.DTOs.Members;

namespace LionGroup.API.Interfaces;

public interface IMembershipApplicationService
{
    Task<MembershipApplicationDto> SubmitApplicationAsync(CreateMembershipApplicationDto dto);
    Task<List<MembershipApplicationDto>> GetAllApplicationsAsync(string? status = null);
    Task<MembershipApplicationDto?> GetApplicationByIdAsync(int id);
    Task<MemberDto?> ApproveApplicationAsync(int id, ApproveApplicationDto dto);
    Task<bool> RejectApplicationAsync(int id);
    Task<bool> DeleteApplicationAsync(int id);
}
