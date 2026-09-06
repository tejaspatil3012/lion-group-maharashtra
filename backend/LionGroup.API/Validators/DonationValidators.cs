using FluentValidation;
using LionGroup.API.DTOs.Donations;

namespace LionGroup.API.Validators;

public class CreateDonationDtoValidator : AbstractValidator<CreateDonationDto>
{
    public CreateDonationDtoValidator()
    {
        RuleFor(x => x.DonorName)
            .NotEmpty().WithMessage("Donor name is required.")
            .MaximumLength(150).WithMessage("Donor name cannot exceed 150 characters.");

        RuleFor(x => x.DonorMobile)
            .NotEmpty().WithMessage("Mobile number is required.")
            .Matches(@"^[0-9]{10}$").WithMessage("Mobile number must be exactly 10 digits.");

        // Required '@' in email, accepts anything non-whitespace after the '@' (e.g., tejas@liongroup or user@domain.com)
        RuleFor(x => x.DonorEmail)
            .Matches(@"^[^@\s]+@[^@\s]+$")
            .WithMessage("Email must contain '@' followed by a domain or identifier (e.g. tejas@liongroup).")
            .When(x => !string.IsNullOrWhiteSpace(x.DonorEmail));

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Donation amount must be greater than zero.");

        RuleFor(x => x.PaymentMethod)
            .NotEmpty().WithMessage("Payment method is required.");
    }
}
