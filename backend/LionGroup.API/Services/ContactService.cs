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
        var org = await _context.OrganizationInfos.AsNoTracking().FirstOrDefaultAsync();

        return new ContactInfoDto
        {
            OrgNameEnglish = org?.OrgNameEnglish ?? "LION GROUP MAHARASHTRA RAJYA",
            OrgNameMarathi = org?.OrgNameMarathi ?? "लायन ग्रुप महाराष्ट्र राज्य",
            HeadOfficeAddressEnglish = org?.HeadOfficeAddressEnglish ?? "Lion Group Central State Office, Pune, Maharashtra",
            HeadOfficeAddressMarathi = org?.HeadOfficeAddressMarathi ?? "लायन ग्रुप राज्य मुख्य कार्यालय, पुणे, महाराष्ट्र",
            PrimaryPhone = org?.PrimaryPhone ?? "+91 98220 12345",
            EmergencyBloodHelpline = org?.EmergencyBloodHelpline ?? "+91 98220 99999",
            PrimaryEmail = org?.PrimaryEmail ?? "contact@liongroupmaharashtra.org"
        };
    }

    public async Task<bool> SubmitInquiryAsync(CreateInquiryDto dto)
    {
        var inquiry = new ContactInquiry
        {
            FullName = dto.FullName.Trim(),
            Email = dto.Email?.Trim(),
            MobileNumber = dto.MobileNumber.Trim(),
            District = dto.District?.Trim(),
            Subject = dto.Subject.Trim(),
            Message = dto.Message.Trim(),
            SubmittedAt = DateTime.UtcNow
        };

        await _context.ContactInquiries.AddAsync(inquiry);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<ContactInquiry>> GetAllInquiriesAsync()
    {
        return await _context.ContactInquiries
            .AsNoTracking()
            .OrderByDescending(i => i.SubmittedAt)
            .ToListAsync();
    }

    public async Task<bool> DeleteInquiryAsync(int id)
    {
        var inquiry = await _context.ContactInquiries.FindAsync(id);
        if (inquiry == null) return false;

        _context.ContactInquiries.Remove(inquiry);
        await _context.SaveChangesAsync();
        return true;
    }
}
