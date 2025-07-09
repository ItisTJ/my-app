import React, { useState, FormEvent, useEffect, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import {
  uploadPrivacyPolicy,
  fetchPrivacyPolicies,
  deletePrivacyPolicy,
  editPrivacyPolicy
} from "../../state/PrivacyPolicy/privacyPolicy.action-creators";
import { useTypedSelector } from "../../hooks";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../../state";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const PrivacyPolicyManager = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();

  const [submittedPolicies, setSubmittedPolicies] = useState<any[]>([]);
  const [editingPolicyId, setEditingPolicyId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPrivacyPolicies());
    fetchSubmittedPolicies();
  }, [dispatch]);

  const fetchSubmittedPolicies = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/privacyPolicy");
      setSubmittedPolicies(response.data);
    } catch (error) {
      console.error("Error fetching privacy policies:", error);
    }
  };

  const { loading, error } = useTypedSelector(
    (state) => state.privacyPolicy || { loading: false, error: null }
  );

  const [policies, setPolicies] = useState([{ title: "", description: "" }]);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...policies];
    (updated[index] as any)[field] = value;
    setPolicies(updated);
  };

  const addPolicy = () => {
    setPolicies([...policies, { title: "", description: "" }]);
  };

  const removePolicy = (index: number) => {
    const updated = policies.filter((_, i) => i !== index);
    setPolicies(updated);
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingPolicyId) {
        const success = await dispatch(editPrivacyPolicy(editingPolicyId, policies[0]));
        if (success) {
          setMessage("Privacy Policy updated successfully.");
          setEditingPolicyId(null);
          setPolicies([{ title: "", description: "" }]);
        } else {
          setMessage("Failed to update policy.");
        }
      } else {
        const success = await dispatch<any>(uploadPrivacyPolicy(policies));
        if (success) {
          setMessage("Privacy Policies uploaded successfully.");
        } else {
          setMessage("Failed to upload policies.");
        }
      }
      await dispatch<any>(fetchPrivacyPolicies());
      fetchSubmittedPolicies();
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Error submitting policies.");
    }
  };

  const handleEdit = (policy: any) => {
    setEditingPolicyId(policy._id);
    setPolicies([{ title: policy.title, description: policy.description }]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this policy?")) return;
    try {
      const success = await dispatch(deletePrivacyPolicy(id));
      if (success) {
        setMessage("Privacy Policy deleted successfully.");
        await dispatch<any>(fetchPrivacyPolicies());
        fetchSubmittedPolicies();
      } else {
        setMessage("Failed to delete policy.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("Error deleting policy.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-center text-2xl font-bold mb-4">
        {editingPolicyId ? "Edit Privacy Policy" : "Add Privacy Policies"}
      </h1>
      {message && (
        <div
          className={`p-3 rounded mb-4 ${
            message.includes("success")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
          <button
            onClick={() => setMessage(null)}
            className="float-right px-3 py-1 text-xl"
          >
            &times;
          </button>
        </div>
      )}
      <form onSubmit={onSubmitHandler} className="space-y-6">
        {policies.map((policy, index) => (
          <div key={index} className="border rounded p-4 space-y-4">
            <div>
              <label className="block font-bold mb-1">Title</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={policy.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Description</label>
              <textarea
                className="w-full border p-2 rounded"
                rows={4}
                value={policy.description}
                onChange={(e) => handleChange(index, "description", e.target.value)}
              ></textarea>
            </div>
            {policies.length > 1 && (
              <button
                type="button"
                onClick={() => removePolicy(index)}
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-red-700 to-red-500 px-6 py-3 text-white shadow-md transition-all duration-300 hover:shadow-lg"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {!editingPolicyId && (
          <button
            type="button"
            onClick={addPolicy}
            className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-950 to-teal-500 px-6 py-3 text-white shadow-md transition-all duration-300 hover:shadow-lg"
          >
            Add Policy
          </button>
        )}
        <button
          type="submit"
          className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-950 to-teal-500 px-6 py-3 text-white shadow-md transition-all duration-300 hover:shadow-lg w-full mt-6"
        >
          {editingPolicyId ? "Save Changes" : "Submit Policies"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-10 mb-4">Submitted Privacy Policies</h2>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full table-auto border-collapse text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submittedPolicies.map((policy, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{policy.title}</td>
                  <td className="px-4 py-2">{policy.description}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => handleEdit(policy)}
                      className="text-blue-600 hover:text-blue-800 text-lg"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(policy._id)}
                      className="text-red-600 hover:text-red-800 text-lg"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PrivacyPolicyManager;
