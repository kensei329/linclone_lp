"use client";
import { useState } from "react";

export default function DeleteUserPage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState("");

  // Mock delete function
  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      // Simulate API call delay
      await new Promise((res) => setTimeout(res, 1500));
      // Simulate success
      setDeleted(true);
    } catch {
      setError("Failed to delete user. Please try again.");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center text-red-600">Delete Account</h1>
        {deleted ? (
          <div className="text-center">
            <p className="text-green-600 font-semibold mb-4">Your account has been deleted.</p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-gray-700 text-center">
              Deleting your account is <span className="font-semibold text-red-500">permanent</span> and cannot be undone. All your data will be lost.
            </p>
            {error && (
              <div className="mb-4 text-red-500 text-center">{error}</div>
            )}
            <button
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
              onClick={() => setShowConfirm(true)}
              disabled={loading}
            >
              Delete My Account
            </button>
          </>
        )}
      </div>
      {/* Confirmation Dialog */}
      {showConfirm && !deleted && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-2 text-red-600">Are you sure?</h2>
            <p className="mb-4 text-gray-700">This action cannot be undone. Do you really want to delete your account?</p>
            <div className="flex gap-2">
              <button
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 