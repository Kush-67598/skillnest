"use client";

import Head from "next/head";
import React, { useState, useEffect } from "react";
export default function OrderPage({ params }) {
  const unwrapped = React.use(params); // unwrap promise
  const courseId = unwrapped.courseId;
  const [Course, setCourse] = useState(null);
  const [token, setToken] = useState(null);
  useEffect(() => {
    if (!token) return; // wait for token
    FetchSingleCourse();
  }, [token]);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("USER_TOKEN");
    if (!token) return;

    const FetchSingleCourse = async () => {
      const res = await fetch(`/api/Course/${courseId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.reqCourse) setCourse(data.reqCourse);
    };

    FetchSingleCourse();
  }, [courseId]); // run only when CourseId is available

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(0);
  const [c_id, setC_id] = useState(null);
  useEffect(() => {
    if (Course) {
      setAmount(Course.price);
      setC_id(Course._id);
    }
  }, [Course]);

  const [submitted, setSubmitted] = useState(false);

  const handlePayment = async () => {
    const txn = await fetch("/api/txn", {
      body: JSON.stringify({ name, email, phone, amount, c_id }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await txn.json();
    console.log(res);
    var options = {
      key: process.env.NEXT_PUBLIC_KEY_ID,
      amount: res.razor.amount, // Amount is in currency subunits.
      currency: "INR",
      name: "SkillNest", //your business name
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: res.razor.id, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      // callback_url: "http://localhost:3000/api/payments",
      handler: function (response) {
        console.log(response);
        fetch(`${process.env.NEXT_PUBLIC_API}/api/payments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({response:response,email}),
        });
      },
      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
        name: res.model.name, //your customer's name
        email: res.model.email,
        contact: res.model.phone, //Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <>
      <Head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </Head>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
          {Course && (
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-100">
                {Course.title}
              </h1>
              <p className="text-gray-300">{Course.description}</p>
              <div className="flex justify-between text-gray-400"></div>
              <div className="bg-gray-700 p-4 rounded space-y-2">
                <div className="flex justify-between text-gray-100">
                  <span>Course Price:</span>
                  <span>₹{Course.price}</span>
                </div>

                <div className="flex justify-between font-semibold text-gray-100">
                  <span>Total:</span>
                  <span>₹{Course.price}</span>
                </div>
              </div>
              <div>
                {!submitted ? (
                  <>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Payment Button */}
                    <button
                      onClick={handlePayment}
                      disabled={!name || !email || !phone}
                      className="w-full bg-purple-600 hover:bg-purple-400 cursor-pointer py-3 rounded text-white font-semibold  mt-4"
                    >
                      Pay Now
                    </button>
                  </>
                ) : (
                  // Success Message
                  <div className="text-center p-6 bg-gray-700 rounded space-y-4">
                    <h2 className="text-2xl font-bold text-green-400">
                      Payment Successful!
                    </h2>
                    <p className="text-gray-200">
                      Thank you, {name}, for enrolling in {Course.title}.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white"
                    >
                      Place Another Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
