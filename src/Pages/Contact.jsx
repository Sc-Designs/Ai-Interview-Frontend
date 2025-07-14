import React from 'react';
import { useForm } from 'react-hook-form';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Card from "../Components/Card"

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      message: ''
    }
  });

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  return (
    <div>
      <Navbar />
      <section className="bg-[#0A0A0A] text-[#FFF] py-20 text-center font-Okomito px-6">
        <h1 className="mb-4 text-5xl font-bold">Get in Touch</h1>
        <p className="text-[#D1D5DB] text-lg max-w-3xl mx-auto border-none">
          Have questions, suggestions, or feedback? We’d love to hear from you.
        </p>
      </section>
      <section className="bg-[#0A0A0A] text-[#FFF] py-5 md:py-0 px-6">
        <div className="max-w-3xl mx-auto bg-[#1d2b43] p-8 rounded-2xl shadow-lg">
          <h2 className="mb-6 text-3xl font-bold text-center">
            Send Us a Message
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-[#D1D5DB] mb-2" htmlFor="name">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                {...register("name", { required: "Name is required" })}
                className="w-full px-4 py-3 rounded-lg bg-card text-[#FFF] border border-gray-700 outline-none"
                placeholder="John Doe"
              />
              {errors.name && (
                <span className="text-sm text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-[#D1D5DB] mb-2" htmlFor="email">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full px-4 py-3 invalid:border-pink-600 rounded-lg bg-card text-[#FFF] border border-gray-700 outline-none"
                placeholder="john@example.com"
              />
              {errors.email && (
                <span className="text-sm text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-[#D1D5DB] mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                rows="5"
                {...register("message", { required: "Message is required" })}
                className="w-full px-4 py-3 resize-none rounded-lg bg-card outline-none text-[#FFF] border border-gray-700"
                placeholder="Type your message..."></textarea>
              {errors.message && (
                <span className="text-sm text-red-500">
                  {errors.message.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="bg-[#FFF] border-none outline-none text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition">
              Submit
            </button>
          </form>
        </div>
      </section>
      <section className="bg-[#0A0A0A] text-[#FFF] py-16 px-6">
        <div className="grid max-w-4xl gap-12 mx-auto md:grid-cols-2">
          <Card heading={"📧 Email"} para={"suvamchakraborti2004@gmail.com"} />
          <Card
            heading={"📍 Location"}
            para={"Durgapur, India (Remote-first)"}
          />
          <div className="bg-blue-900/70 duration-200 cursor-pointer hover:-translate-y-1.5 hover:drop-shadow-[0px_0px_10px_rgba(0,0,190,0.9)] px-4 py-4 rounded-2xl">
            <h3 className="mb-2 text-2xl font-bold">🔗 Social</h3>
            <p className="text-[#D1D5DB]">
              <a
                href="https://www.linkedin.com/in/suvam-chakraborti/"
                target="_blank"
                className="mr-4 underline text-primary">
                LinkedIn
              </a>
              <a
                href="https://x.com/SUVAM_001"
                target="_blank"
                className="underline text-primary">
                X (Twitter)
              </a>
            </p>
          </div>
          <Card
            heading={"💡 Feedback"}
            para={
              "Your suggestions help us improve. Drop your thoughts — we read every one."
            }
          />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
