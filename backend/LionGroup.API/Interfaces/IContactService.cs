using LionGroup.API.DTOs.Contact;

namespace LionGroup.API.Interfaces;

public interface IContactService
{
    Task<ContactInfoDto> GetContactInfoAsync();
    Task<bool> SubmitInquiryAsync(CreateInquiryDto dto);
}
