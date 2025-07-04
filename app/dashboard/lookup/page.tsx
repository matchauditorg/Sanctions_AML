/**
 * Purpose:
 * This page displays a lookup table for reason codes used in the screening process.
 * Merchants can use this to understand the meaning behind AI-driven screening decisions,
 * such as why a customer might be blocked or flagged (e.g. due to PEP match, sanctions, or risk exposure).
 */

'use client';

import React from 'react';
import { reasonCodeMap } from '@/lib/reasonCodes';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const ReasonCodeLookupPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📘 Reason Code Lookup</h1>

      <Card>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4">Reason Code</TableHead>
                <TableHead className="w-3/4">Explanation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(reasonCodeMap).map(([code, explanation]) => (
                <TableRow key={code}>
                  <TableCell className="font-semibold">{code}</TableCell>
                  <TableCell>{explanation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReasonCodeLookupPage;
