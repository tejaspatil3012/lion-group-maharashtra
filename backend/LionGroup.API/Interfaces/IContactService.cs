using LionGroup.API.DTOs.Contact;
using LionGroup.API.Models;

namespace LionGroup.API.Interfaces;

public interface IContactService
{
    Task<ContactInfoDto> GetContactInfoAsync();
    Task<bool> SubmitInquiryAsync(CreateInquiryDto dto);
    Task<List<ContactInquiry>> GetAllInquiriesAsync();
    Task<bool> DeleteInquiryAsync(int id);
}
