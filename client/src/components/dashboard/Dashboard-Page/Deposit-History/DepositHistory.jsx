import { useState, useEffect } from "react";
import axios from "axios";
import { useToasts } from "react-toast-notifications";
import { User, DollarSign, CreditCard, Gift, FileText, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import SpinLoader from "@/components/shared/loader/SpinLoader";
import DeleteModal from "@/components/shared/modal/DeleteModal";


export default function DepositHistory() {
  const { addToast } = useToasts();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [editForm, setEditForm] = useState({ amount: "", status: "", reason: "" });

  // Fetch all deposit transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/admin/depositTransactions`);
        setTransactions(response.data.data);
      } catch (error) {
        addToast(`Error fetching transactions: ${error.message}`, {
          appearance: "error",
          autoDismiss: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [addToast]);

  // Open edit modal
  const openEditModal = (transaction) => {
    if (transaction.status === "approved") {
      addToast("Approved transactions cannot be updated", {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }
    setSelectedTransaction(transaction);
    setEditForm({
      amount: transaction.amount.toString(),
      status: transaction.status,
      reason: transaction.reason || "",
    });
    setEditModalOpen(true);
  };

  // Open details modal
  const openDetailsModal = (transaction) => {
    setSelectedTransaction(transaction);
    setDetailsModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (transaction) => {
    if (transaction.status === "approved") {
      addToast("Approved transactions cannot be deleted", {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }
    setSelectedTransaction(transaction);
    setDeleteModalOpen(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedTransaction(null);
    setEditForm({ amount: "", status: "", reason: "" });
  };

  // Close details modal
  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedTransaction(null);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedTransaction(null);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Update transaction
  const handleUpdate = async () => {
    try {
      if (!editForm.amount || isNaN(editForm.amount) || parseFloat(editForm.amount) < 200) {
        addToast("Amount must be a valid number and at least 200", {
          appearance: "error",
          autoDismiss: true,
        });
        return;
      }
      if (editForm.status === "rejected" && !editForm.reason.trim()) {
        addToast("Reason is required for rejection", {
          appearance: "error",
          autoDismiss: true,
        });
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_API_URL}/admin/depositTransactions/${selectedTransaction.id}`,
        {
          amount: parseFloat(editForm.amount),
          status: editForm.status,
          reason: editForm.status === "rejected" ? editForm.reason : "",
        }
      );

      setTransactions((prev) =>
        prev.map((t) =>
          t.id === selectedTransaction.id
            ? {
                ...t,
                amount: parseFloat(editForm.amount),
                status: editForm.status,
                reason: editForm.status === "rejected" ? editForm.reason : "",
              }
            : t
        )
      );

      addToast("Transaction updated successfully!", {
        appearance: "success",
        autoDismiss: true,
      });
      closeEditModal();
    } catch (error) {
      addToast(`Error updating transaction: ${error.response?.data?.error || error.message}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  // Delete transaction
  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_API_URL}/admin/depositTransactions/${selectedTransaction.id}`);
      setTransactions((prev) => prev.filter((t) => t.id !== selectedTransaction.id));
      addToast("Transaction deleted successfully!", {
        appearance: "success",
        autoDismiss: true,
      });
      closeDeleteModal();
    } catch (error) {
      addToast(`Error deleting transaction: ${error.response?.data?.error || error.message}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  // Get promotion bonus label
  const getBonusLabel = (transaction) => {
    if (!transaction.promotion) return "N/A";
    const { bonusType, bonus } = transaction.promotion;
    return bonusType === "Percentage" ? `${bonus}%` : `${bonus}TK`;
  };

  return (
    <Card className="m-4 md:m-6">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">Deposit History</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <SpinLoader />
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-center text-gray-500">No transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50 text-gray-700">
                  <th className="py-3 px-4 border-b text-left text-sm font-semibold">User Name</th>
                  <th className="py-3 px-4 border-b text-left text-sm font-semibold">User Number</th>
                  <th className="py-3 px-4 border-b text-left text-sm font-semibold">Payment Method</th>
                  <th className="py-3 px-4 border-b text-left text-sm font-semibold">Amount</th>
                  <th className="py-3 px-4 border-b text-left text-sm font-semibold">Promotion Bonus</th>
                  <th className="py-3 px-4 border-b text-left text-sm font-semibold">Status</th>
                  <th className="py-3 px-4 border-b text-left text-sm font-semibold">Created At</th>
                  <th className="py-3 px-4 border-b text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 border-b text-gray-800">{transaction.user?.username || "N/A"}</td>
                    <td className="py-3 px-4 border-b text-gray-800">{transaction.user?.number || "N/A"}</td>
                    <td className="py-3 px-4 border-b text-gray-800">{transaction.paymentMethod.methodNameBD}</td>
                    <td className="py-3 px-4 border-b text-gray-800">{transaction.amount} TK</td>
                    <td className="py-3 px-4 border-b text-gray-800">{getBonusLabel(transaction)}</td>
                    <td className="py-3 px-4 border-b">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          transaction.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-b text-gray-800">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 border-b flex gap-2">
                      <Button
                        variant="link"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => openDetailsModal(transaction)}
                      >
                        Details
                      </Button>
                      {["pending", "rejected"].includes(transaction.status) && (
                        <>
                          <Button
                            variant="link"
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => openEditModal(transaction)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="link"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => openDeleteModal(transaction)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Edit Transaction: {selectedTransaction?.transactionId}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-6">
            <div>
              <Label htmlFor="amount" className="text-sm font-medium text-gray-700">Amount</Label>
              <Input
                id="amount"
                type="number"
                name="amount"
                value={editForm.amount}
                onChange={handleInputChange}
                className="mt-1"
                min="200"
              />
            </div>
            <div>
              <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status</Label>
              <select
                id="status"
                name="status"
                value={editForm.status}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-md border border-gray-300 bg-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            {editForm.status === "rejected" && (
              <div>
                <Label htmlFor="reason" className="text-sm font-medium text-gray-700">
                  Reason for Rejection <span className="text-red-500">*</span>
                </Label>
                <textarea
                  id="reason"
                  name="reason"
                  value={editForm.reason}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Enter reason for rejection"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEditModal}>Cancel</Button>
            <Button onClick={handleUpdate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center">
              <FileText className="h-6 w-6 mr-2 text-blue-500" />
              Transaction Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-6">
            {/* Transaction Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                  Transaction Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Transaction ID</p>
                    <p className="text-base font-medium text-gray-800">{selectedTransaction?.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="text-base font-medium text-gray-800">{selectedTransaction?.amount} TK</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span
                      className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                        selectedTransaction?.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : selectedTransaction?.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedTransaction?.status.charAt(0).toUpperCase() + selectedTransaction?.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Created At</p>
                    <p className="text-base font-medium text-gray-800">
                      {selectedTransaction && new Date(selectedTransaction.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {selectedTransaction?.reason && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Reason for Rejection</p>
                      <p className="text-base font-medium text-gray-800">{selectedTransaction.reason}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* User Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-500" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Username</p>
                    <p className="text-base font-medium text-gray-800">{selectedTransaction?.user?.username || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Number</p>
                    <p className="text-base font-medium text-gray-800">{selectedTransaction?.user?.number || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">User ID</p>
                    <p className="text-base font-medium text-gray-800">{selectedTransaction?.userId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-purple-500" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Method Name</p>
                    <p className="text-base font-medium text-gray-800">{selectedTransaction?.paymentMethod.methodNameBD}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Agent Wallet Number</p>
                    <p className="text-base font-medium text-gray-800">{selectedTransaction?.paymentMethod.agentWalletNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gateways</p>
                    <p className="text-base font-medium text-gray-800">{selectedTransaction?.paymentMethod.gateways.join(", ")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Input Fields</p>
                    {selectedTransaction?.paymentMethod.userInputs.length > 0 ? (
                      <ul className="list-disc pl-5 text-base text-gray-800">
                        {selectedTransaction.paymentMethod.userInputs.map((input, index) => (
                          <li key={index}>
                            {input.labelBD} ({input.type}, {input.isRequired === "true" ? "Required" : "Optional"})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-base text-gray-500 italic">No input fields available</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Promotion */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Gift className="h-5 w-5 mr-2 text-yellow-500" />
                  Promotion
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedTransaction?.promotion ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Title</p>
                      <p className="text-base font-medium text-gray-800">{selectedTransaction.promotion.titleBD}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Bonus Type</p>
                      <p className="text-base font-medium text-gray-800">{selectedTransaction.promotion.bonusType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Bonus</p>
                      <p className="text-base font-medium text-gray-800">{getBonusLabel(selectedTransaction)}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-base text-gray-500 italic">No promotion applied</p>
                )}
              </CardContent>
            </Card>

            {/* User Inputs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-indigo-500" />
                  User Inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedTransaction && Object.entries(selectedTransaction.userInputs).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(selectedTransaction.userInputs).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm text-gray-600">{key}</p>
                        <p className="text-base font-medium text-gray-800">
                          {value.type === "file" ? (
                            <a
                              href={`${import.meta.env.VITE_BASE_API_URL}${value.data}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 underline flex items-center"
                            >
                              <ExternalLink className="h-5 w-5 mr-1" />
                              View File
                            </a>
                          ) : (
                            value.data
                          )}
                          <span className="text-sm text-gray-500">
                            {" "}
                            (Type: {value.type}, Level: {value.level})
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-base text-gray-500 italic">No user inputs provided</p>
                )}
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDetailsModal}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        closeModal={closeDeleteModal}
        handleDelete={handleDelete}
      />
    </Card>
  );
}