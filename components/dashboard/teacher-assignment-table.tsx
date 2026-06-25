import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Assignment {
  class_id: string;
  subject_id: string;
  class_name: string;
  subject_name: string;
}

interface Props {
  assignments: Assignment[];
}

export function TeacherAssignmentTable({ assignments }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Teaching Assignments</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class</TableHead>
              <TableHead>Subject</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {assignments.map((item) => (
              <TableRow key={`${item.class_id}-${item.subject_id}`}>
                <TableCell>{item.class_name}</TableCell>

                <TableCell>{item.subject_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
