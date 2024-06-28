/* eslint-disable no-nested-ternary */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from './navbar';

function Invoice() {
    const [invoices, setInvoices] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newInvoice, setNewInvoice] = useState({
        id: null,
        invoice_number: '',
        due_date: '',
        total_amount: '',
        customer: '',
        status: 'Draft',
    });
    const formRef = useRef(null);

    useEffect(() => {
        axios
            .get('http://localhost:3000/invoiceData')
            .then((response) => {
                setInvoices(response.data);
            })
            .catch((error) => {
                console.error('Error fetching the data:', error);
            });
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setIsFormVisible(false);
            }
        };

        if (isFormVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFormVisible]);

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'total_amount') {
            setNewInvoice({ ...newInvoice, [name]: `£${value}` });
        } else if (name === 'invoice_number') {
            setNewInvoice({ ...newInvoice, [name]: `#${value}` });
        } else {
            setNewInvoice({ ...newInvoice, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newInvoice.id) {
            // Update existing invoice
            axios
                .put(`http://localhost:3000/invoiceData/${newInvoice.id}`, newInvoice)
                .then(() => {
                    const updatedInvoices = invoices.map((invoice) =>
                        invoice.id === newInvoice.id ? newInvoice : invoice
                    );
                    setInvoices(updatedInvoices);
                    setNewInvoice({
                        id: null,
                        invoice_number: '',
                        due_date: '',
                        total_amount: '',
                        customer: '',
                        status: 'Draft',
                    });
                    setIsFormVisible(false);
                })
                .catch((error) => {
                    console.error('Error updating the invoice:', error);
                });
        } else {
            // Create new invoice
            axios
                .post('http://localhost:3000/invoiceData', newInvoice)
                .then((response) => {
                    setInvoices([...invoices, response.data]);
                    setNewInvoice({
                        id: null,
                        invoice_number: '',
                        due_date: '',
                        total_amount: '',
                        customer: '',
                        status: 'Draft',
                    });
                    setIsFormVisible(false);
                })
                .catch((error) => {
                    console.error('Error submitting the data:', error);
                });
        }
    };

    const editInvoice = (invoice) => {
        setNewInvoice({
            id: invoice.id,
            invoice_number: invoice.invoice_number.replace('#', ''),
            due_date: invoice.due_date,
            total_amount: invoice.total_amount.replace('£', ''),
            customer: invoice.customer,
            status: invoice.status,
        });
        setIsFormVisible(true);
    };

    const deleteInvoice = (id) => {
        axios
            .delete(`http://localhost:3000/invoiceData/${id}`)
            .then(() => {
                const updatedInvoices = invoices.filter((invoice) => invoice.id !== id);
                setInvoices(updatedInvoices);
            })
            .catch((error) => {
                console.error('Error deleting the invoice:', error);
            });
    };

    const filteredInvoices = invoices.filter((invoice) => {
        if (filterStatus === 'all') return true;
        if (filterStatus === 'paid' && invoice.status === 'Paid') return true;
        if (filterStatus === 'pending' && invoice.status === 'Pending') return true;
        if (filterStatus === 'draft' && invoice.status === 'Draft') return true;
        return false;
    });

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 min-h-screen">
                <div className="w-full max-w-5xl mt-8 md:ml-10 p-4">
                    <div className="flex flex-row md:flex-row justify-between items-center mb-6">
                        <div className="text-2xl font-bold">
                            Invoices
                            <div className="text-xs text-gray-600 dark:text-gray-400">{invoices.length} invoices</div>
                        </div>

                        {isFormVisible && (
                            <div className="fixed inset-0  h-min  bg-opacity-50 flex  z-50 ">
                                <div ref={formRef} className="bg-white  p-8 rounded-r-xl shadow-md  w-2/5 ">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="invoice_number">
                                                Invoice Number
                                            </label>
                                            <input
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="invoice_number"
                                                type="text"
                                                name="invoice_number"
                                                value={newInvoice.invoice_number.replace('#', '')}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="due_date">
                                                Due Date
                                            </label>
                                            <input
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="due_date"
                                                type="date"
                                                name="due_date"
                                                value={newInvoice.due_date}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="total_amount">
                                                Total Amount
                                            </label>
                                            <input
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="total_amount"
                                                type="number"
                                                name="total_amount"
                                                value={newInvoice.total_amount.replace('£', '')}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customer">
                                                Customer
                                            </label>
                                            <input
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="customer"
                                                type="text"
                                                name="customer"
                                                value={newInvoice.customer}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                                                Status
                                            </label>
                                            <select
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="status"
                                                name="status"
                                                value={newInvoice.status}
                                                onChange={handleInputChange}
                                            >
                                                <option value="Draft">Draft</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Paid">Paid</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <button
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                type="submit"
                                            >
                                                Save Invoice
                                            </button>
                                            <button
                                                className="text-gray-500 hover:text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                type="button"
                                                onClick={() => setIsFormVisible(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                        <button
                            className="bg-purple-600 px-4 py-2 rounded-full mt-4 md:mt-0"
                            onClick={() => {
                                setIsFormVisible(true);
                                setNewInvoice({
                                    id: null,
                                    invoice_number: '',
                                    due_date: '',
                                    total_amount: '',
                                    customer: '',
                                    status: 'Draft',
                                });
                            }}
                        >
                            New Invoice
                        </button>
                    </div>
                    <div className="flex flex-row md:flex-row justify-between items-center mb-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Filter by status</div>
                        <select
                            className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-400 dark:border-gray-600 rounded-full px-3 py-2 focus:outline-none mt-2 md:mt-0"
                            value={filterStatus}
                            onChange={handleFilterChange}
                        >
                            <option value="all">All</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>

                    {filteredInvoices.map((invoice) => (
                        <div
                            key={invoice.id}
                            className="bg-gray-200 dark:bg-gray-800 rounded-xl p-4 mb-4"
                        >
                            {/* Mobile View (Row-wise) */}
                            <div className="flex flex-row justify-between items-start w-full text-justify md:hidden">
                                <div className='flex flex-col gap-2'>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.invoice_number}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Due {invoice.due_date}</p>
                                    <p className="text-lg font-bold">{invoice.total_amount}</p>
                                </div>
                                <div className="flex flex-col items-center gap-2 mt-2">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.customer}</p>

                                    <div className={`flex flex-row rounded-2xl text-sm font-semibold items-center px-4 py-2 w-28 h-10 
                                ${invoice.status === 'Paid' ? 'text-green-500 bg-green-200 dark:bg-customgreen' :
                                            invoice.status === 'Pending' ? 'text-yellow-600 bg-yellow-200 dark:bg-customyellow' :
                                                'text-gray-100 bg-gray-400 bg-opacity-30'}`}>
                                        <div className={`w-2 h-2 rounded-full mr-2 ${invoice.status === 'Paid' ? 'bg-green-500' :
                                            invoice.status === 'Pending' ? 'bg-yellow-500' :
                                                'bg-gray-100'}`} />
                                        {invoice.status}
                                    </div>
                                    <div className="flex items-center gap-4">

                                        <button
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                            onClick={() => deleteInvoice(invoice.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop View (Column-wise) */}
                            <button onClick={() => editInvoice(invoice)} className="hidden md:flex md:flex-row justify-between items-start w-full text-justify">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 w-32">{invoice.invoice_number}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 w-32">Due {invoice.due_date}</p>
                                <p className="text-lg font-bold mt-3 w-32">{invoice.total_amount}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 w-32">{invoice.customer}</p>
                                <div className="flex items-center gap-4">
                                    <div className={`flex flex-row text-xl font-semibold rounded-full items-center px-4 py-2 w-32 h-10 
                                ${invoice.status === 'Paid' ? 'text-green-500 bg-green-200 dark:bg-customgreen' :
                                            invoice.status === 'Pending' ? 'text-yellow-600 bg-yellow-200 dark:bg-customyellow' :
                                                'text-gray-100 bg-gray-400 bg-opacity-30'}`}>
                                        <div className={`w-2 h-2 rounded-full mr-2 ${invoice.status === 'Paid' ? 'bg-green-500' :
                                            invoice.status === 'Pending' ? 'bg-yellow-500' :
                                                'bg-gray-100'}`} />
                                        {invoice.status}
                                    </div>
                                    <div className="flex items-center gap-4">

                                        <button
                                            className="bg-purple-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                            onClick={() => deleteInvoice(invoice.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </button>

                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Invoice;
