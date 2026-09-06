using FluentValidation;
using LionGroup.API.DTOs.Membership;

namespace LionGroup.API.Validators;

public class CreateMembershipApplicationDtoValidator : AbstractValidator<CreateMembershipApplicationDto>
{
    public CreateMembershipApplicationDtoValidator()
    {
        RuleFor(x => x.FullNameEnglish)
            .NotEmpty().WithMessage("Full Name in English is required.")
            .MaximumLength(150).WithMessage("Full Name in English cannot exceed 150 characters.");

        RuleFor(x => x.FullNameMarathi)
            .NotEmpty().WithMessage("Full Name in Marathi is required.")
            .MaximumLength(150).WithMessage("Full Name in Marathi cannot exceed 150 characters.");

        RuleFor(x => x.MobileNumber)
            .NotEmpty().WithMessage("Mobile number is required.")
            .Matches(@"^[0-9]{10}$").WithMessage("Mobile number must be exactly 10 digits.");

        // Required '@' in email, accepts anything non-whitespace after the '@' (e.g., tejas@liongroup or user@domain.com)
        RuleFor(x => x.Email)
            .Matches(@"^[^@\s]+@[^@\s]+$")
            .WithMessage("Email must contain '@' followed by a domain or identifier (e.g. tejas@liongroup).")
            .When(x => !string.IsNullOrWhiteSpace(x.Email));

        RuleFor(x => x.District)
            .NotEmpty().WithMessage("District is required.")
            .MaximumLength(100).WithMessage("District cannot exceed 100 characters.");
    }
}
