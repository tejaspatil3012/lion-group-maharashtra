using FluentValidation;
using LionGroup.API.DTOs.Members;

namespace LionGroup.API.Validators;

public class CreateMemberDtoValidator : AbstractValidator<CreateMemberDto>
{
    public CreateMemberDtoValidator()
    {
        RuleFor(x => x.FullNameEnglish)
            .NotEmpty().WithMessage("Full Name in English is required.")
            .MaximumLength(150).WithMessage("Full Name in English cannot exceed 150 characters.");

        RuleFor(x => x.FullNameMarathi)
            .NotEmpty().WithMessage("Full Name in Marathi is required.")
            .MaximumLength(150).WithMessage("Full Name in Marathi cannot exceed 150 characters.");

        RuleFor(x => x.DesignationId)
            .GreaterThan(0).WithMessage("Please select a valid designation.");

        RuleFor(x => x.District)
            .NotEmpty().WithMessage("District is required.")
            .MaximumLength(100).WithMessage("District cannot exceed 100 characters.");

        RuleFor(x => x.MobileNumber)
            .Matches(@"^[0-9]{10}$")
            .WithMessage("Mobile number must be exactly 10 digits.")
            .When(x => !string.IsNullOrWhiteSpace(x.MobileNumber));

        // Required '@' in email, accepts anything non-whitespace after the '@' (e.g., tejas@liongroup or user@domain.com)
        RuleFor(x => x.Email)
            .Matches(@"^[^@\s]+@[^@\s]+$")
            .WithMessage("Email must contain '@' followed by a domain or identifier (e.g. tejas@liongroup).")
            .When(x => !string.IsNullOrWhiteSpace(x.Email));

        RuleFor(x => x.Taluka)
            .MaximumLength(100).WithMessage("Taluka cannot exceed 100 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.Taluka));

        RuleFor(x => x.VillageOrCity)
            .MaximumLength(100).WithMessage("Village/City cannot exceed 100 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.VillageOrCity));
    }
}

public class UpdateMemberDtoValidator : AbstractValidator<UpdateMemberDto>
{
    public UpdateMemberDtoValidator()
    {
        Include(new CreateMemberDtoValidator());
    }
}

public class CreateDesignationDtoValidator : AbstractValidator<CreateDesignationDto>
{
    public CreateDesignationDtoValidator()
    {
        RuleFor(x => x.NameEnglish)
            .NotEmpty().WithMessage("Designation name in English is required.")
            .MaximumLength(100).WithMessage("Designation name in English cannot exceed 100 characters.");

        RuleFor(x => x.NameMarathi)
            .NotEmpty().WithMessage("Designation name in Marathi is required.")
            .MaximumLength(100).WithMessage("Designation name in Marathi cannot exceed 100 characters.");
    }
}
