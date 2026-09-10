import React from 'react';

const Table = ({ columns, data }) => {
    return (
        <div className=" overflow-hidden">
            {/* Mobile View: Card Layout */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {data?.map((row, rowIndex) => (
                    <div
                        key={row.id || rowIndex}
                        className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 space-y-3"
                    >
                        {columns?.map((col, colIndex) => (
                            <div key={colIndex} className="flex justify-between items-center text-sm gap-4">
                                <span className="font-medium text-gray-500 flex items-center gap-1">
                                    {col.header}
                                </span>
                                <span className="text-gray-800 text-right flex items-center justify-end">
                                    {/* Supports custom render functions or raw accessor values */}
                                    {col.render ? col.render(row) : row[col.accessor || col.key]}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Desktop View: Standard Table Layout */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-500 text-xs font-medium border-b border-gray-200">
                            {columns?.map((col, index) => (
                                <th
                                    key={index}
                                    className={`py-3 px-4 ${col.width || ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                        {data?.map((row, rowIndex) => (
                            <tr
                                key={row.id || rowIndex}
                                className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors group"
                            >
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className="py-4 px-4">
                                        {/* Supports custom render functions or raw accessor values */}
                                        {col.render ? col.render(row) : row[col.accessor || col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;