using Microsoft.EntityFrameworkCore;
using LionGroup.API.Models;

namespace LionGroup.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Designation> Designations => Set<Designation>();
    public DbSet<Member> Members => Set<Member>();
    public DbSet<Activity> Activities => Set<Activity>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<GalleryAlbum> GalleryAlbums => Set<GalleryAlbum>();
    public DbSet<GalleryImage> GalleryImages => Set<GalleryImage>();
    public DbSet<OrganizationInfo> OrganizationInfos => Set<OrganizationInfo>();
    public DbSet<ContactInquiry> ContactInquiries => Set<ContactInquiry>();
    public DbSet<MembershipApplication> MembershipApplications => Set<MembershipApplication>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Designation -> Member (1 to Many)
        modelBuilder.Entity<Designation>(entity =>
        {
            entity.HasKey(d => d.Id);
            entity.Property(d => d.NameEnglish).HasMaxLength(150).IsUnicode(true).IsRequired();
            entity.Property(d => d.NameMarathi).HasMaxLength(150).IsUnicode(true).IsRequired();

            entity.HasMany(d => d.Members)
                  .WithOne(m => m.Designation)
                  .HasForeignKey(m => m.DesignationId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Member
        modelBuilder.Entity<Member>(entity =>
        {
            entity.HasKey(m => m.Id);
            entity.Property(m => m.FullNameEnglish).HasMaxLength(200).IsUnicode(true).IsRequired();
            entity.Property(m => m.FullNameMarathi).HasMaxLength(200).IsUnicode(true).IsRequired();
            entity.Property(m => m.District).HasMaxLength(100).IsUnicode(true).IsRequired();
            entity.Property(m => m.Taluka).HasMaxLength(100).IsUnicode(true);
            entity.Property(m => m.VillageOrCity).HasMaxLength(100).IsUnicode(true);
            entity.Property(m => m.MobileNumber).HasMaxLength(20);
            entity.Property(m => m.Email).HasMaxLength(150);
            entity.Property(m => m.PhotoUrl).HasMaxLength(500);

            entity.HasIndex(m => m.District);
            entity.HasIndex(m => m.IsCoreLeader);
            entity.HasIndex(m => m.IsActive);
        });

        // Activity
        modelBuilder.Entity<Activity>(entity =>
        {
            entity.HasKey(a => a.Id);
            entity.Property(a => a.TitleEnglish).HasMaxLength(250).IsUnicode(true).IsRequired();
            entity.Property(a => a.TitleMarathi).HasMaxLength(250).IsUnicode(true).IsRequired();
            entity.Property(a => a.Category).HasMaxLength(50).IsRequired();
            entity.Property(a => a.SummaryEnglish).HasMaxLength(500).IsUnicode(true);
            entity.Property(a => a.SummaryMarathi).HasMaxLength(500).IsUnicode(true);
            entity.Property(a => a.DescriptionEnglish).IsUnicode(true);
            entity.Property(a => a.DescriptionMarathi).IsUnicode(true);
            entity.Property(a => a.Location).HasMaxLength(200).IsUnicode(true);
            entity.Property(a => a.District).HasMaxLength(100).IsUnicode(true);
            entity.Property(a => a.BannerImageUrl).HasMaxLength(500);

            entity.HasIndex(a => a.Category);
            entity.HasIndex(a => a.ActivityDate);
            entity.HasIndex(a => a.IsFeatured);
        });

        // Event
        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TitleEnglish).HasMaxLength(250).IsUnicode(true).IsRequired();
            entity.Property(e => e.TitleMarathi).HasMaxLength(250).IsUnicode(true).IsRequired();
            entity.Property(e => e.DescriptionEnglish).IsUnicode(true);
            entity.Property(e => e.DescriptionMarathi).IsUnicode(true);
            entity.Property(e => e.Venue).HasMaxLength(300).IsUnicode(true);
            entity.Property(e => e.District).HasMaxLength(100).IsUnicode(true);
            entity.Property(e => e.ChiefGuests).HasMaxLength(300).IsUnicode(true);
            entity.Property(e => e.BannerImageUrl).HasMaxLength(500);
            entity.Property(e => e.Status).HasMaxLength(50).IsRequired();

            entity.HasIndex(e => e.StartDateTime);
            entity.HasIndex(e => e.Status);
        });

        // GalleryAlbum -> GalleryImage (1 to Many)
        modelBuilder.Entity<GalleryAlbum>(entity =>
        {
            entity.HasKey(g => g.Id);
            entity.Property(g => g.TitleEnglish).HasMaxLength(250).IsUnicode(true).IsRequired();
            entity.Property(g => g.TitleMarathi).HasMaxLength(250).IsUnicode(true).IsRequired();
            entity.Property(g => g.DescriptionEnglish).HasMaxLength(500).IsUnicode(true);
            entity.Property(g => g.DescriptionMarathi).HasMaxLength(500).IsUnicode(true);
            entity.Property(g => g.CoverImageUrl).HasMaxLength(500);

            entity.HasMany(g => g.Images)
                  .WithOne(i => i.GalleryAlbum)
                  .HasForeignKey(i => i.GalleryAlbumId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // GalleryImage
        modelBuilder.Entity<GalleryImage>(entity =>
        {
            entity.HasKey(i => i.Id);
            entity.Property(i => i.ImageUrl).HasMaxLength(500).IsRequired();
            entity.Property(i => i.CaptionEnglish).HasMaxLength(300).IsUnicode(true);
            entity.Property(i => i.CaptionMarathi).HasMaxLength(300).IsUnicode(true);
        });

        // OrganizationInfo
        modelBuilder.Entity<OrganizationInfo>(entity =>
        {
            entity.HasKey(o => o.Id);
            entity.Property(o => o.OrgNameEnglish).HasMaxLength(200).IsUnicode(true);
            entity.Property(o => o.OrgNameMarathi).HasMaxLength(200).IsUnicode(true);
            entity.Property(o => o.TaglineEnglish).HasMaxLength(300).IsUnicode(true);
            entity.Property(o => o.TaglineMarathi).HasMaxLength(300).IsUnicode(true);
            entity.Property(o => o.MissionEnglish).IsUnicode(true);
            entity.Property(o => o.MissionMarathi).IsUnicode(true);
            entity.Property(o => o.VisionEnglish).IsUnicode(true);
            entity.Property(o => o.VisionMarathi).IsUnicode(true);
            entity.Property(o => o.AboutHistoryEnglish).IsUnicode(true);
            entity.Property(o => o.AboutHistoryMarathi).IsUnicode(true);
            entity.Property(o => o.PresidentNameEnglish).HasMaxLength(200).IsUnicode(true);
            entity.Property(o => o.PresidentNameMarathi).HasMaxLength(200).IsUnicode(true);
            entity.Property(o => o.PresidentMessageEnglish).IsUnicode(true);
            entity.Property(o => o.PresidentMessageMarathi).IsUnicode(true);
            entity.Property(o => o.PresidentPhotoUrl).HasMaxLength(500);
            entity.Property(o => o.PrimaryPhone).HasMaxLength(50);
            entity.Property(o => o.EmergencyBloodHelpline).HasMaxLength(50);
            entity.Property(o => o.PrimaryEmail).HasMaxLength(150);
            entity.Property(o => o.HeadOfficeAddressEnglish).HasMaxLength(300).IsUnicode(true);
            entity.Property(o => o.HeadOfficeAddressMarathi).HasMaxLength(300).IsUnicode(true);
        });

        // ContactInquiry
        modelBuilder.Entity<ContactInquiry>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.FullName).HasMaxLength(150).IsUnicode(true).IsRequired();
            entity.Property(c => c.MobileNumber).HasMaxLength(20).IsRequired();
            entity.Property(c => c.Email).HasMaxLength(150);
            entity.Property(c => c.Subject).HasMaxLength(200).IsUnicode(true).IsRequired();
            entity.Property(c => c.Message).HasMaxLength(2000).IsUnicode(true).IsRequired();
            entity.Property(c => c.District).HasMaxLength(100).IsUnicode(true);
        });
    }
}
