"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { myAppHook } from '@/context/AppProvider';

interface formData {
  name?: string;
  phone?: string;
  street?: string;
  zip?: string;
  city?: string;
  country?: string;
  email: string;
  password: string;
  password_confirmation?: string;
}

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [formData, setFormData] = useState<formData>({
    name: "",
    phone: "",
    street: "",
    city: "",
    zip: "",
    country: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const { login, register } = myAppHook();

  const handleOnChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log('Form Data:', formData); // Debug log

    if (!isLogin) {
      // Registration validation
      if (!formData.email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
      }
      if (formData.password !== formData.password_confirmation) {
        alert('Passwords do not match.');
        return;
      }
    //   if (!formData.phone.match(/^\+?\d{10,15}$/)) {
    //     alert('Please enter a valid phone number.');
    //     return;
    //   }
      if (!formData.name || !formData.street || !formData.zip || !formData.city || !formData.country) {
        alert('Please fill out all required fields.');
        return;
      }
    }

    if (isLogin) {
      try {
        await login(formData.email, formData.password);
      } catch (error) {
        console.error(`Authentication Error: ${error}`);
        alert('Login failed. Please check your credentials.');
      }
    } else {
      try {
        await register(
          formData.name!,
          formData.phone!,
          formData.street!,
          formData.zip!,
          formData.city!,
          formData.country!,
          formData.email,
          formData.password,
          formData.password_confirmation!,
        );
      } catch (error: any) {
        console.error(`Registration Error: ${error}`);
        if (error.details) {
          alert(`Registration failed: ${Object.values(error.details).join(', ')}`);
        } else {
          alert('Registration failed. Please try again.');
        }
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: "500px" }}>
        <h3 className="text-center">{isLogin ? 'Login' : 'Register'}</h3>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                className="form-control mb-2"
                name="name"
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={handleOnChangeInput}
                required
              />
              <input
                className="form-control mb-2"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleOnChangeInput}
                placeholder="Phone"
              />
              <input
                className="form-control mb-2"
                name="street"
                type="text"
                value={formData.street}
                onChange={handleOnChangeInput}
                placeholder="Street"
              />
              <input
                className="form-control mb-2"
                name="zip"
                type="text"
                value={formData.zip}
                onChange={handleOnChangeInput}
                placeholder="Zip code"
              />
              <input
                className="form-control mb-2"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleOnChangeInput}
                placeholder="City"
              />
              <input
                className="form-control mb-2"
                name="country"
                type="text"
                value={formData.country}
                onChange={handleOnChangeInput}
                placeholder="Country"
              />
            </>
          )}
          <input
            className="form-control mb-2"
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleOnChangeInput}
            required
          />
          <input
            className="form-control mb-2"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleOnChangeInput}
            placeholder="Password"
            required
          />
          {!isLogin && (
            <input
              className="form-control mb-2"
              name="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={handleOnChangeInput}
              placeholder="Confirm Password"
            />
          )}
          <button className="btn btn-primary w-100" type="submit">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <Link
          href="#"
          onClick={() => setIsLogin(!isLogin)}
          className="mt-3 text-center text-success"
          style={{ textDecoration: "none" }}
        >
          {!isLogin ? "Already have an account? Login" : "Don't have an account? Register"}
        </Link>
      </div>
    </div>
  );
};

export default Auth;