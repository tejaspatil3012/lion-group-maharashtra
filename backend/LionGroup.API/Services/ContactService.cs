using Microsoft.EntityFrameworkCore;
using LionGroup.API.Data;
using LionGroup.API.DTOs.Contact;
using LionGroup.API.Interfaces;
using LionGroup.API.Models;

namespace LionGroup.API.Services;

public class ContactService : IContactService
{
    private readonly ApplicationDbContext _context;

    public ContactService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ContactInfoDto> GetContactInfoAsync()
    {
        var org = await _context.OrganizationInfos.FirstOrDefaultAsync() ?? new OrganizationInfo();

        return new ContactInfoDto
        {
            OrgNameEnglish = org.OrgNameEnglish,
            OrgNameMarathi = org.OrgNameMarathi,
            PrimaryPhone = org.PrimaryPhone,
            EmergencyBloodHelpline = org.EmergencyBloodHelpline,
            PrimaryEmail = org.PrimaryEmail,
            HeadOfficeAddressEnglish = org.HeadOfficeAddressEnglish,
            HeadOfficeAddressMarathi = org.HeadOfficeAddressMarathi
        };
    }

    public async Task<bool> SubmitInquiryAsync(CreateInquiryDto dto)
    {
        var inquiry = new ContactInquiry
        {
            FullName = dto.FullName,
            MobileNumber = dto.MobileNumber,
            Email = dto.Email,
            Subject = dto.Subject,
            Message = dto.Message,
            District = dto.District,
            SubmittedAt = DateTime.UtcNow
        };

        await _context.ContactInquiries.AddAsync(inquiry);
        await _context.SaveChangesAsync();
        return true;
    }
}
