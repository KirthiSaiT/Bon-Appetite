/* Hallmark · genre: editorial · shared design system */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import emailjs from '@emailjs/browser';
import { SimpleFooter } from "@/components/Footer";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    details: ["+91 9390105767"],
    description: "Call us for quick orders and inquiries",
  },
  {
    icon: Mail,
    title: "Email",
    details: ["kirthisai251@gmail.com"],
    description: "Send us your questions anytime",
  },
  {
    icon: MapPin,
    title: "Location",
    details: ["8-1-284/OU/461, OU Colony", "Shaikpet, Hyderabad", "Telangana 500008"],
    description: "Our main kitchen location",
  },
  {
    icon: Clock,
    title: "Operating Hours",
    details: ["Mon–Sun: 10:00 AM – 11:00 PM"],
    description: "We're here to serve you",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    emailjs.send(
      'service_0ngsn9l',
      'template_rdzt2i6',
      {
        from_name: `${formData.firstName} ${formData.lastName}`,
        to_name: "Bon Appetite",
        subject: formData.subject,
        message: `You have a new contact message!\nFrom: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n---\nMessage:\n${formData.message}`,
        user_email: formData.email
      },
      'lBQ8UpD7SH9b45AVq'
    )
    .then(() => {
      alert("Thank you for your message! We'll get back to you soon.");
      setFormData({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });
    })
    .catch(() => {
      alert("Sorry, there was an error sending your message. Please try again later.");
    });
  };

  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <Navigation />

      {/* ── Page hero ── */}
      <section className="px-8 md:px-14 xl:px-20 pt-16 pb-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <span className="text-orange-600 text-[0.63rem] tracking-[0.25em] uppercase font-semibold mb-6 block">
            Get in Touch
          </span>
          <h1
            className="text-[2.8rem] md:text-[4rem] xl:text-[5rem] font-bold leading-[1.05] text-stone-900 mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Contact <span className="text-orange-600">Us.</span>
          </h1>
          <div className="w-10 h-px bg-orange-600 mb-6" />
          <p className="text-stone-600 text-lg leading-relaxed max-w-2xl">
            Have a question, suggestion, or want to place a special order? We'd love to hear from you.
          </p>
        </div>
      </section>

      <div className="h-px bg-stone-200" />

      {/* ── Form + Contact Info ── */}
      <section className="py-14 px-8 md:px-14 xl:px-20 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <h2
              className="text-2xl font-bold text-stone-900 mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Send us a message
            </h2>
            <p className="text-stone-500 text-sm mb-8">We'll get back to you within 24 hours.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-stone-700 font-semibold text-sm">First Name</Label>
                  <Input id="firstName" name="firstName" placeholder="Enter your first name"
                    value={formData.firstName} onChange={handleInputChange} required
                    className="focus-visible:ring-orange-500" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-stone-700 font-semibold text-sm">Last Name</Label>
                  <Input id="lastName" name="lastName" placeholder="Enter your last name"
                    value={formData.lastName} onChange={handleInputChange} required
                    className="focus-visible:ring-orange-500" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-stone-700 font-semibold text-sm">Email</Label>
                <Input id="email" name="email" type="email" placeholder="Enter your email"
                  value={formData.email} onChange={handleInputChange} required
                  className="focus-visible:ring-orange-500" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-stone-700 font-semibold text-sm">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="Enter your phone number"
                  value={formData.phone} onChange={handleInputChange}
                  className="focus-visible:ring-orange-500" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject" className="text-stone-700 font-semibold text-sm">Subject</Label>
                <Input id="subject" name="subject" placeholder="What's this about?"
                  value={formData.subject} onChange={handleInputChange} required
                  className="focus-visible:ring-orange-500" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message" className="text-stone-700 font-semibold text-sm">Message</Label>
                <Textarea id="message" name="message" placeholder="Tell us more..."
                  className="min-h-32 focus-visible:ring-orange-500 resize-none"
                  value={formData.message} onChange={handleInputChange} required />
              </div>
              <Button type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-600">
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h2
              className="text-2xl font-bold text-stone-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Our details
            </h2>
            {contactInfo.map((info) => (
              <div key={info.title} className="flex items-start gap-4">
                <div className="bg-orange-50 p-2.5 flex-shrink-0">
                  <info.icon className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-bold text-stone-900 text-sm mb-1">{info.title}</p>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-stone-600 text-sm">{detail}</p>
                  ))}
                  <p className="text-stone-400 text-xs mt-1">{info.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Map ── */}
      <section className="py-14 px-8 md:px-14 xl:px-20 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
            <div>
              <span className="text-[0.63rem] tracking-[0.25em] uppercase text-stone-400 mb-3 block">Find Us</span>
              <h2
                className="text-2xl md:text-3xl font-bold text-stone-900"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Our Kitchen
              </h2>
            </div>
            <p className="text-stone-500 text-sm leading-relaxed md:text-right">
              8-1-284/OU/461, OU Colony<br />
              Shaikpet, Hyderabad, Telangana 500008
            </p>
          </div>
          <div className="h-96 overflow-hidden">
            <iframe
              title="Bon Appetit Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.2397337089713!2d78.43399631487946!3d17.39876588807051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb97b0f9f839b1%3A0x3c3b3e7c3b2b2b2b!2sOU%20Colony%2C%20Shaikpet%2C%20Hyderabad%2C%20Telangana%20500008!5e0!3m2!1sen!2sin!4v1629789456789!5m2!1sen!2sin"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <SimpleFooter />
    </div>
  );
};

export default Contact;
