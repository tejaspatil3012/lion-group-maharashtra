using Microsoft.EntityFrameworkCore;
using LionGroup.API.Models;

namespace LionGroup.API.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(ApplicationDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        if (await context.OrganizationInfos.AnyAsync())
        {
            return; // DB has already been seeded
        }

        // 1. Seed Organization Info
        var orgInfo = new OrganizationInfo
        {
            OrgNameEnglish = "LION GROUP MAHARASHTRA RAJYA",
            OrgNameMarathi = "लायन ग्रुप महाराष्ट्र राज्य",
            TaglineEnglish = "Dedicated to Social Service, Unity & Community Empowerment",
            TaglineMarathi = "समाजसेवा, एकता आणि लोककल्याण यासाठी कटिबद्ध",
            MissionEnglish = "To selflessly serve the people of Maharashtra through extensive social service drives including blood donation camps, environmental conservation, free medical relief, education empowerment, and emergency disaster assistance, fostering unity and youth leadership.",
            MissionMarathi = "रक्तदान शिबिरे, पर्यावरण संवर्धन, मोफत आरोग्य सेवा, शैक्षणिक मदत आणि आपत्कालीन साहाय्य यांसारख्या सामाजिक उपक्रमांद्वारे महाराष्ट्रातील जनतेची निस्वार्थ सेवा करणे, तसेच युवकांमध्ये नेतृत्व व सामाजिक बांधिलकीची भावना वृद्धिंगत करणे.",
            VisionEnglish = "To establish a resilient, empowered, and compassionate society where every citizen has access to healthcare, education, environmental sustainability, and timely humanitarian aid across all 36 districts of Maharashtra.",
            VisionMarathi = "महाराष्ट्रातील सर्व ३६ जिल्ह्यांमध्ये आरोग्य, शिक्षण, पर्यावरण संतुलन आणि वेळेवर मानवतावादी मदत पोहोचवून एका सक्षम, सुदृढ आणि संवेदनशील समाजाची निर्मिती करणे.",
            AboutHistoryEnglish = "Founded with a sacred pledge to serve humanity, Lion Group Maharashtra Rajya has grown into a premier state-wide social service organization. With thousands of dedicated volunteers and active branches across Western Maharashtra, Marathwada, Vidarbha, Konkan, and Khandesh, the organization relentlessly works for societal welfare, youth guidance, and grassroots development.",
            AboutHistoryMarathi = "मानवतेची अविरत सेवा करण्याच्या पवित्र ध्येयाने स्थापन झालेली 'लायन ग्रुप महाराष्ट्र राज्य' ही आज राज्यभरातील अग्रगण्य सामाजिक संस्था बनली आहे. पश्चिम महाराष्ट्र, मराठवाडा, विदर्भ, कोकण आणि खान्देशमधील हजारो निष्ठावंत कार्यकर्ते व पदाधिकाऱ्यांच्या साथीने ही संघटना अविरतपणे लोककल्याण, युवक मार्गदर्शन आणि तळागाळातील समाजविकासासाठी कार्यरत आहे.",
            PresidentNameEnglish = "Shri. Chandrakant (Dada) Patil",
            PresidentNameMarathi = "श्री. चंद्रकांत (दादा) पाटील",
            PresidentMessageEnglish = "Welcome to Lion Group Maharashtra Rajya. Our organization stands firmly on the pillars of selfless dedication, integrity, and collective action. Every blood unit donated, every sapling planted, and every family supported during crises brings us closer to a prosperous and healthy Maharashtra. I invite all citizens, especially our vibrant youth, to join hands in this noble journey of social transformation.",
            PresidentMessageMarathi = "लायन ग्रुप महाराष्ट्र राज्याच्या अधिकृत संकेतस्थळावर आपले सहर्ष स्वागत! आमची संस्था निस्वार्थ सेवा, एकता आणि सामाजिक बांधिलकी या मूल्यांवर ठामपणे उभी आहे. आम्ही केलेले प्रत्येक रक्तदान, लावलेले प्रत्येक झाड आणि संकटाच्या काळात दिलेला प्रत्येक मदतीचा हात आपल्याला एका सुदृढ आणि समृद्ध महाराष्ट्राच्या दिशेने घेऊन जातो. सामाजिक परिवर्तनाच्या या पवित्र कार्यात महाराष्ट्रातील सर्व नागरिक आणि विशेषतः युवा शक्तीने सहभागी व्हावे, हेच माझे मनोगत आहे.",
            PresidentPhotoUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
            PrimaryPhone = "+91 98220 12345",
            EmergencyBloodHelpline = "+91 98220 99999",
            PrimaryEmail = "contact@liongroupmaharashtra.org",
            HeadOfficeAddressEnglish = "Lion Group State Central Office, Near Chhatrapati Shivaji Maharaj Chowk, FC Road, Shivajinagar, Pune - 411005, Maharashtra",
            HeadOfficeAddressMarathi = "लायन ग्रुप राज्य मुख्य कार्यालय, छत्रपती शिवाजी महाराज चौकाजवळ, एफसी रोड, शिवाजीनगर, पुणे - ४११००५, महाराष्ट्र",
            TotalMembersCount = 2850,
            TotalBloodUnitsDonated = 5420,
            TotalTreesPlanted = 18600,
            TotalBeneficiariesServed = 62000
        };
        await context.OrganizationInfos.AddAsync(orgInfo);

        // 2. Seed Designations
        var designations = new List<Designation>
        {
            new() { NameEnglish = "State President", NameMarathi = "महाराष्ट्र राज्य अध्यक्ष", DisplayOrder = 1, IsCoreLeader = true },
            new() { NameEnglish = "State Vice President", NameMarathi = "महाराष्ट्र राज्य उपाध्यक्ष", DisplayOrder = 2, IsCoreLeader = true },
            new() { NameEnglish = "State General Secretary", NameMarathi = "महाराष्ट्र राज्य सरचिटणीस", DisplayOrder = 3, IsCoreLeader = true },
            new() { NameEnglish = "State Treasurer", NameMarathi = "महाराष्ट्र राज्य खजिनदार", DisplayOrder = 4, IsCoreLeader = true },
            new() { NameEnglish = "State Youth President", NameMarathi = "राज्य युवक अध्यक्ष", DisplayOrder = 5, IsCoreLeader = true },
            new() { NameEnglish = "State Women Wing Chief", NameMarathi = "राज्य महिला आघाडी प्रमुख", DisplayOrder = 6, IsCoreLeader = true },
            new() { NameEnglish = "District President", NameMarathi = "जिल्हाध्यक्ष", DisplayOrder = 7, IsCoreLeader = false },
            new() { NameEnglish = "District Secretary", NameMarathi = "जिल्हा सचिव", DisplayOrder = 8, IsCoreLeader = false },
            new() { NameEnglish = "Executive Committee Member", NameMarathi = "राज्य कार्यकारणी सदस्य", DisplayOrder = 9, IsCoreLeader = false },
            new() { NameEnglish = "Active Member", NameMarathi = "सक्रिय सदस्य", DisplayOrder = 10, IsCoreLeader = false }
        };
        await context.Designations.AddRangeAsync(designations);
        await context.SaveChangesAsync();

        // 3. Seed Members
        var dPresident = designations.First(d => d.NameEnglish == "State President").Id;
        var dVP = designations.First(d => d.NameEnglish == "State Vice President").Id;
        var dSec = designations.First(d => d.NameEnglish == "State General Secretary").Id;
        var dTreasurer = designations.First(d => d.NameEnglish == "State Treasurer").Id;
        var dYouth = designations.First(d => d.NameEnglish == "State Youth President").Id;
        var dWomen = designations.First(d => d.NameEnglish == "State Women Wing Chief").Id;
        var dDist = designations.First(d => d.NameEnglish == "District President").Id;
        var dExec = designations.First(d => d.NameEnglish == "Executive Committee Member").Id;

        var members = new List<Member>
        {
            new()
            {
                FullNameEnglish = "Shri. Chandrakant (Dada) Patil",
                FullNameMarathi = "श्री. चंद्रकांत (दादा) पाटील",
                DesignationId = dPresident,
                MobileNumber = "+91 98220 12345",
                Email = "president@liongroupmaharashtra.org",
                District = "Pune",
                Taluka = "Haveli",
                VillageOrCity = "Pune",
                PhotoUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
                DisplayOrder = 1,
                IsCoreLeader = true,
                IsActive = true,
                JoinedDate = new DateTime(2018, 1, 15)
            },
            new()
            {
                FullNameEnglish = "Shri. Vijayrao Shinde",
                FullNameMarathi = "श्री. विजयराव शिंदे",
                DesignationId = dVP,
                MobileNumber = "+91 98221 23456",
                Email = "vp@liongroupmaharashtra.org",
                District = "Chhatrapati Sambhajinagar",
                Taluka = "Aurangabad",
                VillageOrCity = "Chhatrapati Sambhajinagar",
                PhotoUrl = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
                DisplayOrder = 2,
                IsCoreLeader = true,
                IsActive = true,
                JoinedDate = new DateTime(2018, 3, 20)
            },
            new()
            {
                FullNameEnglish = "Adv. Rajesh K. Deshmukh",
                FullNameMarathi = "ॲड. राजेश के. देशमुख",
                DesignationId = dSec,
                MobileNumber = "+91 98222 34567",
                Email = "secretary@liongroupmaharashtra.org",
                District = "Nagpur",
                Taluka = "Nagpur Urban",
                VillageOrCity = "Nagpur",
                PhotoUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80",
                DisplayOrder = 3,
                IsCoreLeader = true,
                IsActive = true,
                JoinedDate = new DateTime(2018, 5, 10)
            },
            new()
            {
                FullNameEnglish = "Shri. Sanjay B. Jagtap",
                FullNameMarathi = "श्री. संजय बी. जगताप",
                DesignationId = dTreasurer,
                MobileNumber = "+91 98223 45678",
                Email = "treasurer@liongroupmaharashtra.org",
                District = "Kolhapur",
                Taluka = "Karvir",
                VillageOrCity = "Kolhapur",
                PhotoUrl = "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80",
                DisplayOrder = 4,
                IsCoreLeader = true,
                IsActive = true,
                JoinedDate = new DateTime(2019, 1, 12)
            },
            new()
            {
                FullNameEnglish = "Shri. Prathamesh S. Bhosale",
                FullNameMarathi = "श्री. प्रथमेश एस. भोसले",
                DesignationId = dYouth,
                MobileNumber = "+91 98224 56789",
                Email = "youth@liongroupmaharashtra.org",
                District = "Satara",
                Taluka = "Satara",
                VillageOrCity = "Satara",
                PhotoUrl = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80",
                DisplayOrder = 5,
                IsCoreLeader = true,
                IsActive = true,
                JoinedDate = new DateTime(2020, 2, 1)
            },
            new()
            {
                FullNameEnglish = "Smt. Sunita Tai More",
                FullNameMarathi = "श्रीमती सुनिताताई मोरे",
                DesignationId = dWomen,
                MobileNumber = "+91 98225 67890",
                Email = "women@liongroupmaharashtra.org",
                District = "Nashik",
                Taluka = "Nashik",
                VillageOrCity = "Nashik",
                PhotoUrl = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80",
                DisplayOrder = 6,
                IsCoreLeader = true,
                IsActive = true,
                JoinedDate = new DateTime(2019, 8, 15)
            },
            new()
            {
                FullNameEnglish = "Shri. Ganesh R. Kulkarni",
                FullNameMarathi = "श्री. गणेश आर. कुलकर्णी",
                DesignationId = dDist,
                MobileNumber = "+91 98226 78901",
                Email = "nashik@liongroupmaharashtra.org",
                District = "Nashik",
                Taluka = "Nashik",
                VillageOrCity = "Nashik",
                PhotoUrl = "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=500&q=80",
                DisplayOrder = 7,
                IsCoreLeader = false,
                IsActive = true,
                JoinedDate = new DateTime(2021, 4, 10)
            },
            new()
            {
                FullNameEnglish = "Shri. Nitin P. Gaikwad",
                FullNameMarathi = "श्री. नितीन पी. गायकवाड",
                DesignationId = dDist,
                MobileNumber = "+91 98227 89012",
                Email = "thane@liongroupmaharashtra.org",
                District = "Thane",
                Taluka = "Thane",
                VillageOrCity = "Thane",
                PhotoUrl = "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&q=80",
                DisplayOrder = 8,
                IsCoreLeader = false,
                IsActive = true,
                JoinedDate = new DateTime(2021, 6, 25)
            },
            new()
            {
                FullNameEnglish = "Dr. Mahesh S. Joshi",
                FullNameMarathi = "डॉ. महेश एस. जोशी",
                DesignationId = dExec,
                MobileNumber = "+91 98228 90123",
                Email = "mjoshi@liongroupmaharashtra.org",
                District = "Solapur",
                Taluka = "Solapur North",
                VillageOrCity = "Solapur",
                PhotoUrl = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=80",
                DisplayOrder = 9,
                IsCoreLeader = false,
                IsActive = true,
                JoinedDate = new DateTime(2022, 1, 10)
            },
            new()
            {
                FullNameEnglish = "Shri. Amol V. Jadhav",
                FullNameMarathi = "श्री. अमोल व्ही. जाधव",
                DesignationId = dExec,
                MobileNumber = "+91 98229 01234",
                Email = "ajadhav@liongroupmaharashtra.org",
                District = "Ahmednagar",
                Taluka = "Nagar",
                VillageOrCity = "Ahmednagar",
                PhotoUrl = "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80",
                DisplayOrder = 10,
                IsCoreLeader = false,
                IsActive = true,
                JoinedDate = new DateTime(2022, 5, 18)
            }
        };
        await context.Members.AddRangeAsync(members);

        // 4. Seed Activities
        var activities = new List<Activity>
        {
            new()
            {
                TitleEnglish = "State-wide Mega Blood Donation Camp 2026",
                TitleMarathi = "राज्यव्यापी भव्य रक्तदान महाशिबिर २०२६",
                Category = "BloodDonation",
                SummaryEnglish = "Successfully collected over 850 units of blood in a single day across 12 collection centers in Pune and surrounding districts.",
                SummaryMarathi = "पुणे व परिसरातील १२ केंद्रांवर एकाच दिवसात ८५० हून अधिक रक्त बाटल्यांचे यशस्वी संकलन.",
                DescriptionEnglish = "Under the visionary leadership of Lion Group Maharashtra Rajya, our volunteers organized the State-wide Mega Blood Donation Drive. Partnering with prominent government and civil blood banks, safe donation facilities were provided with professional medical teams.",
                DescriptionMarathi = "लायन ग्रुप महाराष्ट्र राज्याच्या वतीने राज्यातील नामांकित सरकारी व धर्मादाय रक्तपेढ्यांच्या सहकार्याने भव्य रक्तदान महाशिबिर आयोजित करण्यात आले. अत्याधुनिक वैद्यकीय सुविधा व तज्ज्ञ डॉक्टरांच्या उपस्थितीत रक्तदात्यांची मोफत तपासणी करून प्रमाणपत्रे देण्यात आली.",
                Location = "Balewadi Sports Complex, Pune",
                District = "Pune",
                ActivityDate = new DateTime(2026, 6, 14),
                BannerImageUrl = "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80",
                BeneficiariesCount = 2550,
                VolunteersCount = 120,
                IsFeatured = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                TitleEnglish = "Green Maharashtra 25,000 Tree Plantation Drive",
                TitleMarathi = "हरित महाराष्ट्र २५,००० वृक्षारोपण व संवर्धन मोहीम",
                Category = "TreePlantation",
                SummaryEnglish = "Planted and adopted 5,000 native saplings in Nashik and Sahyadri hillside zones with 3-year water stewardship.",
                SummaryMarathi = "नाशिक व सह्याद्रीच्या पट्ट्यात ५,००० देशी रोपांची लागवड व ३ वर्षे जलसंवर्धनाची जबाबदारी.",
                DescriptionEnglish = "To combat climate change and soil erosion, Lion Group launched the massive tree plantation drive. Over 300 youth volunteers planted Banyan, Peepal, Neem, and Jamun saplings equipped with drip irrigation tubes.",
                DescriptionMarathi = "पर्यावरण संतुलन व जलपातळी वाढवण्यासाठी लायन ग्रुपच्या वतीने वड, पिंपळ, कडुलिंब व जांभूळ यांसारख्या देशी वृक्षांची लागवड करण्यात आली. झाडे केवळ लावणे नव्हे तर पुढील तीन वर्षे त्यांच्या संगोपनाचा संकल्प घेण्यात आला.",
                Location = "Trimbak Road & Panchavati Hills, Nashik",
                District = "Nashik",
                ActivityDate = new DateTime(2026, 7, 5),
                BannerImageUrl = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
                BeneficiariesCount = 15000,
                VolunteersCount = 250,
                IsFeatured = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                TitleEnglish = "Free Rural Multi-Specialty Health & Eye Checkup Camp",
                TitleMarathi = "मोफत ग्रामीण सर्वोपचार व नेत्र तपासणी शिबिर",
                Category = "HealthCamp",
                SummaryEnglish = "Provided comprehensive health checkups, ECG, blood sugar tests, and free eyeglasses to 1,200 rural families.",
                SummaryMarathi = "१,२०० ग्रामीण कुटुंबीयांची मोफत आरोग्य तपासणी, ईसीजी, मधुमेह तपासणी व मोफत चष्मे वाटप.",
                DescriptionEnglish = "A team of 25 specialist doctors including cardiologists, ophthalmologists, and gynecologists treated underprivileged villagers. Free medicines and 350 prescription spectacles were distributed.",
                DescriptionMarathi = "हृदयरोग, नेत्ररोग व स्त्रीरोग तज्ज्ञ डॉक्टरांच्या पथकाद्वारे ग्रामीण भागातील गरजू नागरिकांची तपासणी करण्यात आली. मोफत औषधे व ३५० ज्येष्ठ नागरिकांना मोफत चष्मे वाटण्यात आले.",
                Location = "Zilla Parishad High School, Paithan",
                District = "Chhatrapati Sambhajinagar",
                ActivityDate = new DateTime(2026, 5, 20),
                BannerImageUrl = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
                BeneficiariesCount = 1200,
                VolunteersCount = 45,
                IsFeatured = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                TitleEnglish = "Annadaan Food & Grocery Distribution to Flood-Affected Families",
                TitleMarathi = "अन्नदान व पूरग्रस्त कुटुंबियांना किराणा किट वाटप",
                Category = "FoodDistribution",
                SummaryEnglish = "Distributed 1-month essential grocery kits and clean drinking water tankers to 800 affected households.",
                SummaryMarathi = "८०० पूरग्रस्त कुटुंबांना १ महिन्याचे जीवनावश्यक किराणा सामान व पिण्याच्या पाण्याचे टँकर वाटप.",
                DescriptionEnglish = "During unexpected monsoon flooding, Lion Group relief taskforce reached remote villages within 12 hours with dry rations, baby food, blankets, and hygiene kits.",
                DescriptionMarathi = "अचानक उद्भवलेल्या पूरपरिस्थितीत लायन ग्रुपच्या आपत्कालीन पथकाने अवघ्या १२ तासांत दुर्गम भागात पोहोचून अन्नधान्य, लहान मुलांचे खाद्य, ब्लँकेट्स व औषध किट्सचे वाटप केले.",
                Location = "Shirol & Karvir Talukas, Kolhapur",
                District = "Kolhapur",
                ActivityDate = new DateTime(2026, 8, 2),
                BannerImageUrl = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
                BeneficiariesCount = 3200,
                VolunteersCount = 80,
                IsFeatured = false,
                CreatedAt = DateTime.UtcNow
            }
        };
        await context.Activities.AddRangeAsync(activities);

        // 5. Seed Events
        var events = new List<Event>
        {
            new()
            {
                TitleEnglish = "Lion Group State Annual Convention & Leadership Conclave 2026",
                TitleMarathi = "लायन ग्रुप महाराष्ट्र राज्य वार्षिक महाअधिवेशन व नेतृत्व संमेलन २०२६",
                DescriptionEnglish = "Annual state gathering of thousands of Lion Group volunteers, district leaders, social reformers, and dignitaries celebrating achievements and charting future social initiatives.",
                DescriptionMarathi = "महाराष्ट्रभरातील सर्व जिल्हा पदाधिकारी, कार्यकर्ते, सामाजिक क्षेत्रातील मान्यवर आणि युवकांचे भव्य वार्षिक महाअधिवेशन. वर्षभरातील कार्याचा गौरव व आगामी वर्षाच्या सामाजिक उपक्रमांचे नियोजन.",
                Venue = "Shree Shiv Chhatrapati Sports Complex, Mahalunge, Pune",
                District = "Pune",
                StartDateTime = new DateTime(2026, 10, 18, 9, 30, 0),
                EndDateTime = new DateTime(2026, 10, 18, 18, 0, 0),
                ChiefGuests = "Hon. Social Reformers & State Dignitaries",
                BannerImageUrl = "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
                Status = "Upcoming",
                IsFeatured = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                TitleEnglish = "Maharashtra Youth Inspiration Camp & Career Guidance 2026",
                TitleMarathi = "महाराष्ट्र युवा प्रेरणा शिबिर व करिअर मार्गदर्शन मेळावा २०२६",
                DescriptionEnglish = "Free guidance seminars on competitive exams (MPSC/UPSC), entrepreneurship, skill training, and social leadership for rural students.",
                DescriptionMarathi = "स्पर्धा परीक्षा (MPSC/UPSC), उद्योग व्यवसाय, कौशल्य विकास आणि सामाजिक नेतृत्व या विषयांवर ग्रामीण भागातील विद्यार्थ्यांसाठी मोफत मार्गदर्शन परिसंवाद.",
                Venue = "Dr. Babasaheb Ambedkar Marathwada University Auditorium",
                District = "Chhatrapati Sambhajinagar",
                StartDateTime = new DateTime(2026, 11, 8, 10, 0, 0),
                EndDateTime = new DateTime(2026, 11, 8, 16, 30, 0),
                ChiefGuests = "Eminent IAS/IPS Officers & Youth Icons",
                BannerImageUrl = "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
                Status = "Upcoming",
                IsFeatured = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                TitleEnglish = "World Blood Donor Day Felicitations & Drive 2026",
                TitleMarathi = "जागतिक रक्तदाते गौरव सोहळा व रक्तदान शिबिर २०२६",
                DescriptionEnglish = "Felicitation ceremony of 100+ regular blood donors and social workers on the occasion of World Blood Donor Day.",
                DescriptionMarathi = "शतकवीर रक्तदाते व सामाजिक कार्यकर्त्यांचा सन्मान सोहळा आणि रक्तदान शिबिर.",
                Venue = "Town Hall, Satara",
                District = "Satara",
                StartDateTime = new DateTime(2026, 6, 14, 10, 0, 0),
                EndDateTime = new DateTime(2026, 6, 14, 15, 0, 0),
                ChiefGuests = "Civil Surgeon & District Collector",
                BannerImageUrl = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
                Status = "Completed",
                IsFeatured = false,
                CreatedAt = DateTime.UtcNow
            }
        };
        await context.Events.AddRangeAsync(events);

        // 6. Seed Gallery Albums & Images
        var album1 = new GalleryAlbum
        {
            TitleEnglish = "State Blood Donation Mega Drive",
            TitleMarathi = "राज्यस्तरीय रक्तदान महाअभियान",
            DescriptionEnglish = "Memorable moments from the state-wide blood donation centers across Pune, Nashik, and Kolhapur.",
            DescriptionMarathi = "पुणे, नाशिक व कोल्हापूर येथील रक्तदान शिबिरातील अविस्मरणीय क्षणचित्रे.",
            CoverImageUrl = "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80",
            EventDate = new DateTime(2026, 6, 14),
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            Images = new List<GalleryImage>
            {
                new()
                {
                    ImageUrl = "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1000&q=80",
                    CaptionEnglish = "Youth eagerly participating in blood donation",
                    CaptionMarathi = "रक्तदानासाठी उत्साहाने सहभागी झालेले युवक",
                    DisplayOrder = 1
                },
                new()
                {
                    ImageUrl = "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80",
                    CaptionEnglish = "Medical team conducting preliminary health screenings",
                    CaptionMarathi = "वैद्यकीय पथकाद्वारे रक्तदात्यांची आरोग्य तपासणी",
                    DisplayOrder = 2
                },
                new()
                {
                    ImageUrl = "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1000&q=80",
                    CaptionEnglish = "Honoring 50-time regular blood donor",
                    CaptionMarathi = "५० वेळा रक्तदान करणाऱ्या रक्तदात्याचा सत्कार",
                    DisplayOrder = 3
                }
            }
        };

        var album2 = new GalleryAlbum
        {
            TitleEnglish = "Vruksharopan Mahotsav 2026",
            TitleMarathi = "वृक्षारोपण महोत्सव २०२६",
            DescriptionEnglish = "Glimpses of mass plantation and environmental awareness rallies by Lion Group volunteers.",
            DescriptionMarathi = "लायन ग्रुप कार्यकर्त्यांनी राबवलेली व्यापक वृक्षारोपण मोहीम व पर्यावरण जनजागृती फेरी.",
            CoverImageUrl = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
            EventDate = new DateTime(2026, 7, 5),
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            Images = new List<GalleryImage>
            {
                new()
                {
                    ImageUrl = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80",
                    CaptionEnglish = "Planting native banyan and peepal saplings",
                    CaptionMarathi = "वड आणि पिंपळाच्या रोपांची लागवड",
                    DisplayOrder = 1
                },
                new()
                {
                    ImageUrl = "https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=1000&q=80",
                    CaptionEnglish = "School children joining hands for Green Maharashtra",
                    CaptionMarathi = "हरित महाराष्ट्रासाठी एकत्र आलेले शाळकरी विद्यार्थी",
                    DisplayOrder = 2
                }
            }
        };

        await context.GalleryAlbums.AddRangeAsync(new[] { album1, album2 });
        await context.SaveChangesAsync();
    }
}
