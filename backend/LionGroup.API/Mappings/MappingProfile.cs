using AutoMapper;
using LionGroup.API.DTOs.Members;
using LionGroup.API.Models;

namespace LionGroup.API.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Member -> MemberDto
        CreateMap<Member, MemberDto>()
            .ForMember(dest => dest.DesignationEnglish, opt => opt.MapFrom(src => src.Designation != null ? src.Designation.NameEnglish : string.Empty))
            .ForMember(dest => dest.DesignationMarathi, opt => opt.MapFrom(src => src.Designation != null ? src.Designation.NameMarathi : string.Empty));

        // CreateMemberDto -> Member
        CreateMap<CreateMemberDto, Member>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Designation, opt => opt.Ignore())
            .ForMember(dest => dest.FullNameEnglish, opt => opt.MapFrom(src => src.FullNameEnglish.Trim()))
            .ForMember(dest => dest.FullNameMarathi, opt => opt.MapFrom(src => src.FullNameMarathi.Trim()))
            .ForMember(dest => dest.District, opt => opt.MapFrom(src => src.District.Trim()))
            .ForMember(dest => dest.Taluka, opt => opt.MapFrom(src => src.Taluka != null ? src.Taluka.Trim() : null))
            .ForMember(dest => dest.VillageOrCity, opt => opt.MapFrom(src => src.VillageOrCity != null ? src.VillageOrCity.Trim() : null))
            .ForMember(dest => dest.MobileNumber, opt => opt.MapFrom(src => src.MobileNumber != null ? src.MobileNumber.Trim() : null))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email != null ? src.Email.Trim() : null))
            .ForMember(dest => dest.JoinedDate, opt => opt.MapFrom(src => src.JoinedDate ?? DateTime.UtcNow));

        // UpdateMemberDto -> Member
        CreateMap<UpdateMemberDto, Member>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Designation, opt => opt.Ignore())
            .ForMember(dest => dest.FullNameEnglish, opt => opt.MapFrom(src => src.FullNameEnglish.Trim()))
            .ForMember(dest => dest.FullNameMarathi, opt => opt.MapFrom(src => src.FullNameMarathi.Trim()))
            .ForMember(dest => dest.District, opt => opt.MapFrom(src => src.District.Trim()))
            .ForMember(dest => dest.Taluka, opt => opt.MapFrom(src => src.Taluka != null ? src.Taluka.Trim() : null))
            .ForMember(dest => dest.VillageOrCity, opt => opt.MapFrom(src => src.VillageOrCity != null ? src.VillageOrCity.Trim() : null))
            .ForMember(dest => dest.MobileNumber, opt => opt.MapFrom(src => src.MobileNumber != null ? src.MobileNumber.Trim() : null))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email != null ? src.Email.Trim() : null));

        // Designation mappings
        CreateMap<Designation, DesignationDto>();
        CreateMap<CreateDesignationDto, Designation>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Members, opt => opt.Ignore())
            .ForMember(dest => dest.NameEnglish, opt => opt.MapFrom(src => src.NameEnglish.Trim()))
            .ForMember(dest => dest.NameMarathi, opt => opt.MapFrom(src => src.NameMarathi.Trim()));
    }
}
