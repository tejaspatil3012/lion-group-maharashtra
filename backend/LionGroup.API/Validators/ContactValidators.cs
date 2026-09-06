using FluentValidation;
using LionGroup.API.DTOs.Contact;

namespace LionGroup.API.Validators;

public class CreateInquiryDtoValidator : AbstractValidator<CreateInquiryDto>
{
    public CreateInquiryDtoValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required.")
            .MaximumLength(150).WithMessage("Full name cannot exceed 150 characters.");

        RuleFor(x => x.MobileNumber)
            .NotEmpty().WithMessage("Mobile number is required.")
            .Matches(@"^[0-9]{10}$").WithMessage("Mobile number must be exactly 10 digits.");

        // Required '@' in email, accepts anything non-whitespace after the '@' (e.g., tejas@liongroup or user@domain.com)
        RuleFor(x => x.Email)
            .Matches(@"^[^@\s]+@[^@\s]+$")
            .WithMessage("Email must contain '@' followed by a domain or identifier (e.g. tejas@liongroup).")
            .When(x => !string.IsNullOrWhiteSpace(x.Email));

        RuleFor(x => x.Subject)
            .NotEmpty().WithMessage("Subject is required.")
            .MaximumLength(200).WithMessage("Subject cannot exceed 200 characters.");

        RuleFor(x => x.Message)
            .NotEmpty().WithMessage("Message is required.")
            .MaximumLength(2000).WithMessage("Message cannot exceed 2000 characters.");
    }
}
