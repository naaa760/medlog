"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("account");

  // Profile form state
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    username: "",
    email: "",
    receiveMail: true,
    receiveNotifications: true,
  });

  // Error and success message states
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Load user data when available
  useEffect(() => {
    if (isLoaded && user) {
      setFormData({
        name: user.firstName || "",
        bio:
          localStorage.getItem("medium-user-bio") ||
          "Hey there! Thank you for reading my content and keep reading share it with others. Thank you!",
        username: user.username || user.firstName?.toLowerCase() || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        receiveMail: localStorage.getItem("medium-receive-mail") !== "false",
        receiveNotifications:
          localStorage.getItem("medium-receive-notifications") !== "false",
      });
    }
  }, [isLoaded, user]);

  // Handle form change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      // Save to localStorage
      localStorage.setItem("medium-user-bio", formData.bio);
      localStorage.setItem("medium-receive-mail", formData.receiveMail);
      localStorage.setItem(
        "medium-receive-notifications",
        formData.receiveNotifications
      );

      // In a real app, we would also update the user in Clerk
      // This would require proper API calls to Clerk's user management API

      // Show success message
      setSuccessMessage("Profile information saved successfully");
      setErrorMessage("");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setErrorMessage("Failed to save profile information");
      setSuccessMessage("");
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <p className="mb-8">You need to be signed in to view settings.</p>
          <Link
            href="/sign-in"
            className="px-4 py-2 bg-black text-white rounded-full"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-12 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {/* Success and error messages */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex flex-wrap -mb-px">
            <button
              onClick={() => setActiveTab("account")}
              className={`mr-8 py-4 text-sm font-medium border-b-2 ${
                activeTab === "account"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Account
            </button>
            <button
              onClick={() => setActiveTab("publishing")}
              className={`mr-8 py-4 text-sm font-medium border-b-2 ${
                activeTab === "publishing"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Publishing
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`mr-8 py-4 text-sm font-medium border-b-2 ${
                activeTab === "notifications"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("membership")}
              className={`mr-8 py-4 text-sm font-medium border-b-2 ${
                activeTab === "membership"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Membership and payment
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`mr-8 py-4 text-sm font-medium border-b-2 ${
                activeTab === "security"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Security and apps
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="md:flex">
          <div className="w-full md:w-2/3">
            {activeTab === "account" && (
              <div className="space-y-8">
                <form onSubmit={handleSubmit}>
                  <div className="border-b border-gray-200 pb-6">
                    <h2 className="text-sm font-medium text-gray-500 mb-1">
                      Email address
                    </h2>
                    <p className="text-base text-gray-900">{formData.email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Your email address is used for sign-in and notifications
                    </p>
                  </div>

                  <div className="border-b border-gray-200 pb-6 pt-6">
                    <h2 className="text-sm font-medium text-gray-500 mb-1">
                      Username and subdomain
                    </h2>
                    <div className="flex items-center">
                      <span className="text-gray-400">@</span>
                      <span className="text-base text-gray-900 ml-1">
                        {formData.username}
                      </span>
                      <span className="text-gray-400 mx-1">·</span>
                      <span className="text-gray-900">
                        {formData.username}.medium.com
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Your unique identifier on Medium
                    </p>
                  </div>

                  <div className="border-b border-gray-200 pb-6 pt-6">
                    <h2 className="text-sm font-medium text-gray-500 mb-2">
                      Profile information
                    </h2>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                        {user.imageUrl ? (
                          <img
                            src={user.imageUrl}
                            alt={formData.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600 text-sm">
                              {formData.name[0] || ""}
                            </span>
                          </div>
                        )}
                      </div>
                      <label htmlFor="name" className="sr-only">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="text-base text-gray-900 border-b border-gray-300 focus:border-black focus:ring-0 block w-full p-2"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="bio"
                        className="block text-sm text-gray-500 mb-1"
                      >
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        className="block w-full rounded border-gray-300 focus:border-black focus:ring-0"
                        placeholder="Tell us about yourself..."
                      ></textarea>
                      <p className="text-sm text-gray-500 mt-1">
                        This appears on your profile page and in your stories.
                      </p>
                    </div>
                  </div>

                  <div className="border-b border-gray-200 pb-6 pt-6">
                    <h2 className="text-sm font-medium text-gray-500 mb-4">
                      Email notifications
                    </h2>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="receiveMail"
                            name="receiveMail"
                            type="checkbox"
                            checked={formData.receiveMail}
                            onChange={handleChange}
                            className="focus:ring-0 h-4 w-4 text-black border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="receiveMail"
                            className="font-medium text-gray-700"
                          >
                            Email newsletters
                          </label>
                          <p className="text-gray-500">
                            Receive Medium&apos;s newsletter and other
                            occasional emails
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="receiveNotifications"
                            name="receiveNotifications"
                            type="checkbox"
                            checked={formData.receiveNotifications}
                            onChange={handleChange}
                            className="focus:ring-0 h-4 w-4 text-black border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="receiveNotifications"
                            className="font-medium text-gray-700"
                          >
                            Activity notifications
                          </label>
                          <p className="text-gray-500">
                            Comments, highlights, follows, and other activity on
                            your stories
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800"
                    >
                      Save changes
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/profile")}
                      className="ml-3 px-4 py-2 border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>

                <div className="border-b border-gray-200 pb-6 pt-6">
                  <h2 className="text-sm font-medium text-gray-500 mb-2">
                    Muted writers and publications
                  </h2>
                  <div className="flex justify-between items-center">
                    <span className="text-base text-gray-900">
                      Manage the writers and publications you&apos;ve muted
                    </span>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-sm font-medium text-gray-500 mb-2">
                    Blocked users
                  </h2>
                  <div className="flex justify-between items-center">
                    <span className="text-base text-gray-900">
                      Manage the users you&apos;ve blocked
                    </span>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                <div className="pb-6">
                  <h2 className="text-sm font-medium text-red-500 mb-2">
                    Deactivate account
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Deactivating will suspend your account until you sign back
                    in.
                  </p>
                  <button
                    type="button"
                    className="px-4 py-2 border border-red-300 text-red-700 rounded-full text-sm font-medium hover:bg-red-50"
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to deactivate your account? You can reactivate by signing in again."
                        )
                      ) {
                        // In a real app, we would call an API to deactivate
                        alert(
                          "Account deactivation functionality would be implemented here in a real app."
                        );
                      }
                    }}
                  >
                    Deactivate account
                  </button>
                </div>
              </div>
            )}

            {activeTab === "publishing" && (
              <div className="prose">
                <h2>Publishing Settings</h2>
                <p>
                  Configure your publishing preferences here. This tab is under
                  development.
                </p>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Notification Settings</h2>
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">
                    Email Notifications
                  </h3>
                  <div className="space-y-3">
                    {[
                      "New followers",
                      "Comments on your stories",
                      "Responses to your comments",
                      "Claps on your stories",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-700">{item}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">
                    Push Notifications
                  </h3>
                  <div className="space-y-3">
                    {[
                      "New followers",
                      "Comments on your stories",
                      "Responses to your comments",
                      "Claps on your stories",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-700">{item}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800"
                  >
                    Save notification preferences
                  </button>
                </div>
              </div>
            )}

            {activeTab === "membership" && (
              <div className="prose">
                <h2>Membership and Payment</h2>
                <p>
                  Manage your membership and payment details here. This tab is
                  under development.
                </p>

                <div className="mt-8 not-prose">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Current Plan
                    </h3>
                    <p className="text-gray-700 mb-4">
                      You are on the <strong>Medium Free</strong> plan.
                    </p>
                    <button
                      type="button"
                      className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700"
                    >
                      Upgrade to Medium Membership
                    </button>
                    <p className="text-sm text-gray-500 mt-3">
                      Get unlimited access to every story on Medium and support
                      the writers you read most.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">
                  Security and Connected Apps
                </h2>

                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">
                    Password
                  </h3>
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50"
                  >
                    Change password
                  </button>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">
                    Two-factor authentication
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Add an extra layer of security to your account
                  </p>
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50"
                  >
                    Enable two-factor authentication
                  </button>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">
                    Connected applications
                  </h3>
                  <p className="text-gray-700 mb-3">
                    No applications are currently connected to your account
                  </p>
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50"
                  >
                    Connect an application
                  </button>
                </div>

                <div className="pt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">
                    Sessions
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 flex items-center mb-3">
                    <div className="mr-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"
                          clipRule="evenodd"
                        />
                        <path
                          fillRule="evenodd"
                          d="M10 4a1 1 0 100 2 1 1 0 000-2zm0 10a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Current session
                      </p>
                      <p className="text-sm text-gray-500">
                        This device • Active now
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="text-red-600 text-sm font-medium"
                  >
                    Sign out from all devices
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="w-full md:w-1/3 mt-8 md:mt-0 md:pl-12">
            <div className="sticky top-24">
              <h3 className="text-base font-medium mb-4">
                Suggested help articles
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Sign in or sign up to Medium
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Your profile page
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Writing and publishing your first story
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    About Medium&apos;s distribution system
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Get started with the Partner Program
                  </Link>
                </li>
              </ul>

              <div className="mt-12 pt-8 border-t border-gray-200 text-xs text-gray-500 space-y-4">
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  <Link href="#" className="hover:text-gray-700">
                    Help
                  </Link>
                  <Link href="#" className="hover:text-gray-700">
                    Status
                  </Link>
                  <Link href="#" className="hover:text-gray-700">
                    About
                  </Link>
                  <Link href="#" className="hover:text-gray-700">
                    Careers
                  </Link>
                  <Link href="#" className="hover:text-gray-700">
                    Press
                  </Link>
                  <Link href="#" className="hover:text-gray-700">
                    Blog
                  </Link>
                  <Link href="#" className="hover:text-gray-700">
                    Privacy
                  </Link>
                  <Link href="#" className="hover:text-gray-700">
                    Rules
                  </Link>
                  <Link href="#" className="hover:text-gray-700">
                    Terms
                  </Link>
                  <Link href="#" className="hover:text-gray-700">
                    Text to speech
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
