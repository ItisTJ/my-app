import React, { useState, FormEvent, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  uploadPrivacyPolicy,
  fetchPrivacyPolicies,
  deletePrivacyPolicy,
  editPrivacyPolicy,
} from "../../state/PrivacyPolicy/privacyPolicy.action-creators";
import { fetchFooter } from "../../state/Footer/footer.action-creators";
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
  const [message, setMessage] = useState<string | null>(null);

  const [policies, setPolicies] = useState([{ title: "", description: "" }]);
  const [errors, setErrors] = useState<{ title?: string; description?: string }[]>([]);

  const { loading, error } = useTypedSelector(
    (state) => state.privacyPolicy || { loading: false, error: null }
  );

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

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...policies];
    updated[index] = { ...updated[index], [field]: value };
    setPolicies(updated);

    const updatedErrors = [...errors];
    updatedErrors[index] = {
      ...updatedErrors[index],
      [field]: "",
    };
    setErrors(updatedErrors);
  };

  const addPolicy = () => {
    setPolicies([...policies, { title: "", description: "" }]);
    setErrors([...errors, {}]);
  };

  const removePolicy = (index: number) => {
    setPolicies(policies.filter((_, i) => i !== index));
    setErrors(errors.filter((_, i) => i !== index));
  };

  const validatePolicies = () => {
    const validationErrors = policies.map((p) => {
      const err: { title?: string; description?: string } = {};
      if (!p.title.trim()) err.title = "Title is required.";
      if (!p.description.trim()) err.description = "Description is required.";
      return err;
    });

    const hasErrors = validationErrors.some(
      (err) => err.title || err.description
    );

    setErrors(validationErrors);
    return !hasErrors;
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePolicies()) {
      setMessage("Please fill out all required fields.");
      return;
    }

    try {
      if (editingPolicyId) {
        const success = await dispatch(editPrivacyPolicy(editingPolicyId, policies[0]));
        if (success) {
          setMessage("Privacy Policy updated successfully.");
          setEditingPolicyId(null);
          setPolicies([{ title: "", description: "" }]);
          setErrors([]);
          dispatch(fetchFooter());
        } else {
          setMessage("Failed to update policy.");
        }
      } else {
        const success = await dispatch<any>(uploadPrivacyPolicy(policies));
        if (success) {
          setMessage("Privacy Policies uploaded successfully.");
          setPolicies([{ title: "", description: "" }]);
          setErrors([]);
          dispatch(fetchFooter());
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
    setErrors([{}]);
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
        setPolicies([{ title: "", description: "" }]);
        setEditingPolicyId(null);
        setErrors([]);
        dispatch(fetchFooter());
      } else {
        setMessage("Failed to delete policy.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("Error deleting policy.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center mt-8">
        {editingPolicyId ? "Edit Privacy Policy" : "Add Privacy Policies"}
      </h1>

      {message && (
        <div
          className={`p-3 mb-4 rounded ${
            message.toLowerCase().includes("success")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
          <button
            onClick={() => setMessage(null)}
            className="float-right text-xl font-bold"
          >
            &times;
          </button>
        </div>
      )}

      <form onSubmit={onSubmitHandler} className="space-y-6">
        {policies.map((policy, index) => (
          <div key={index} className="border rounded p-4 space-y-4 bg-white shadow">
            <div>
              <label className="block font-semibold mb-1">Title</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={policy.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
              />
              {errors[index]?.title && (
                <p className="text-red-600 text-sm mt-1">{errors[index].title}</p>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                className="w-full border p-2 rounded"
                rows={4}
                value={policy.description}
                onChange={(e) => handleChange(index, "description", e.target.value)}
              />
              {errors[index]?.description && (
                <p className="text-red-600 text-sm mt-1">{errors[index].description}</p>
              )}
            </div>
            {policies.length > 1 && (
              <button
                type="button"
                onClick={() => removePolicy(index)}
                className="bg-gradient-to-r from-red-700 to-red-500 text-white px-4 py-2 rounded-lg shadow hover:shadow-lg transition-all duration-300"
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
            className="bg-gradient-to-r from-blue-950 to-teal-500 text-white px-6 py-3 rounded-lg shadow hover:shadow-lg transition duration-300"
          >
            Add Policy
          </button>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-950 to-teal-500 text-white px-6 py-3 rounded-lg shadow hover:shadow-lg transition duration-300"
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
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submittedPolicies.map((policy, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2 align-top break-words max-w-xs">{policy.title}</td>
                  <td
                    className="px-4 py-2 align-top break-words max-w-xs overflow-hidden whitespace-nowrap overflow-ellipsis"
                    title={policy.description}
                  >
                    {policy.description}
                  </td>
                  <td className="px-4 py-2 flex items-center space-x-4">
                    <button
                      onClick={() => handleEdit(policy)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(policy._id)}
                      className="text-red-600 hover:text-red-800"
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
