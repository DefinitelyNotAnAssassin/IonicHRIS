// Employee data with personal information, leave requests, timesheets, and other HR-related information

export interface TimeRecord {
    date: string
    clockIn: string
    clockOut: string
    totalHours: string
    status: string
    remarks: string
  }
  
  export interface LeaveRequest {
    id: string
    employeeName: string
    type: string
    startDate: string
    endDate: string
    days: number
    reason: string
    status: string
    appliedOn: string
    approvedBy?: string
    approvedOn?: string
    remarks?: string
  }
  
  export interface ScheduleChange {
    id: string
    employeeName: string
    date: string
    currentSchedule: string
    requestedSchedule: string
    reason: string
    status: string
    appliedOn: string
    approvedBy?: string
    approvedOn?: string
    remarks?: string
  }
  
  export interface OfficialBusinessRequest {
    id: string
    employeeName: string
    date: string
    startTime: string
    endTime: string
    purpose: string
    status: string
    appliedOn: string
    approvedBy?: string
    approvedOn?: string
    remarks?: string
  }
  
  export interface Employee {
    id: string
    employeeId: string
    name: string
    email: string
    phone: string
    position: string
    department: string
    status: string
    hireDate: string
    employmentType: string
    manager?: string
    avatar?: string
    leaveBalance: {
      annual: number
      sick: number
      emergency: number
    }
    timeRecords: TimeRecord[]
    leaveRequests: LeaveRequest[]
    scheduleChanges: ScheduleChange[]
    officialBusinessRequests: OfficialBusinessRequest[]
  }
  
  export const employeeData: Employee[] = [
    {
      id: "1",
      employeeId: "EMP001",
      name: "Juan Dela Cruz",
      email: "juan.delacruz@sdca.edu.ph",
      phone: "+63 912 345 6789",
      position: "Senior Developer",
      department: "IT",
      status: "active",
      hireDate: "2020-03-15",
      employmentType: "Full-time",
      manager: "Maria Santos",
      avatar: "/placeholder.svg?height=100&width=100",
      leaveBalance: {
        annual: 15,
        sick: 10,
        emergency: 5,
      },
      timeRecords: [
        {
          date: "2023-06-01",
          clockIn: "08:02:34",
          clockOut: "17:05:21",
          totalHours: "9:02:47",
          status: "present",
          remarks: "",
        },
        {
          date: "2023-06-02",
          clockIn: "07:58:12",
          clockOut: "17:00:05",
          totalHours: "9:01:53",
          status: "present",
          remarks: "",
        },
        {
          date: "2023-06-05",
          clockIn: "08:15:43",
          clockOut: "17:10:22",
          totalHours: "8:54:39",
          status: "late",
          remarks: "Late by 15 minutes",
        },
        {
          date: "2023-06-06",
          clockIn: "08:00:10",
          clockOut: "17:00:33",
          totalHours: "9:00:23",
          status: "present",
          remarks: "",
        },
        {
          date: "2023-06-07",
          clockIn: "",
          clockOut: "",
          totalHours: "0:00:00",
          status: "absent",
          remarks: "Sick leave",
        },
      ],
      leaveRequests: [
        {
          id: "L001",
          employeeName: "Juan Dela Cruz",
          type: "Annual",
          startDate: "2023-06-15",
          endDate: "2023-06-16",
          days: 2,
          reason: "Family vacation",
          status: "approved",
          appliedOn: "2023-06-01",
          approvedBy: "Maria Santos",
          approvedOn: "2023-06-02",
          remarks: "Approved as requested",
        },
      ],
      scheduleChanges: [
        {
          id: "SC001",
          employeeName: "Juan Dela Cruz",
          date: "2023-06-20",
          currentSchedule: "8:00 AM - 5:00 PM",
          requestedSchedule: "10:00 AM - 7:00 PM",
          reason: "Doctor's appointment in the morning",
          status: "pending",
          appliedOn: "2023-06-10",
        },
      ],
      officialBusinessRequests: [],
    },
    {
      id: "2",
      employeeId: "EMP002",
      name: "Maria Santos",
      email: "maria.santos@sdca.edu.ph",
      phone: "+63 923 456 7890",
      position: "IT Manager",
      department: "IT",
      status: "active",
      hireDate: "2018-05-10",
      employmentType: "Full-time",
      avatar: "/placeholder.svg?height=100&width=100",
      leaveBalance: {
        annual: 18,
        sick: 10,
        emergency: 5,
      },
      timeRecords: [
        {
          date: "2023-06-01",
          clockIn: "07:45:12",
          clockOut: "17:30:05",
          totalHours: "9:44:53",
          status: "present",
          remarks: "",
        },
        {
          date: "2023-06-02",
          clockIn: "07:50:22",
          clockOut: "17:15:45",
          totalHours: "9:25:23",
          status: "present",
          remarks: "",
        },
        {
          date: "2023-06-05",
          clockIn: "07:48:33",
          clockOut: "17:20:11",
          totalHours: "9:31:38",
          status: "present",
          remarks: "",
        },
      ],
      leaveRequests: [],
      scheduleChanges: [],
      officialBusinessRequests: [
        {
          id: "OB001",
          employeeName: "Maria Santos",
          date: "2023-06-22",
          startTime: "13:00",
          endTime: "17:00",
          purpose: "Client meeting at their office",
          status: "pending",
          appliedOn: "2023-06-12",
        },
      ],
    },
    {
      id: "3",
      employeeId: "EMP003",
      name: "Antonio Reyes",
      email: "antonio.reyes@sdca.edu.ph",
      phone: "+63 934 567 8901",
      position: "HR Specialist",
      department: "HR",
      status: "active",
      hireDate: "2019-08-20",
      employmentType: "Full-time",
      manager: "Elena Gomez",
      avatar: "/placeholder.svg?height=100&width=100",
      leaveBalance: {
        annual: 12,
        sick: 8,
        emergency: 5,
      },
      timeRecords: [
        {
          date: "2023-06-01",
          clockIn: "08:05:45",
          clockOut: "17:10:33",
          totalHours: "9:04:48",
          status: "present",
          remarks: "",
        },
        {
          date: "2023-06-02",
          clockIn: "08:02:11",
          clockOut: "17:05:22",
          totalHours: "9:03:11",
          status: "present",
          remarks: "",
        },
      ],
      leaveRequests: [
        {
          id: "L002",
          employeeName: "Antonio Reyes",
          type: "Sick",
          startDate: "2023-06-20",
          endDate: "2023-06-20",
          days: 1,
          reason: "Doctor's appointment",
          status: "pending",
          appliedOn: "2023-06-10",
        },
      ],
      scheduleChanges: [],
      officialBusinessRequests: [],
    },
    {
      id: "4",
      employeeId: "EMP004",
      name: "Elena Gomez",
      email: "elena.gomez@sdca.edu.ph",
      phone: "+63 945 678 9012",
      position: "HR Manager",
      department: "HR",
      status: "active",
      hireDate: "2017-11-05",
      employmentType: "Full-time",
      avatar: "/placeholder.svg?height=100&width=100",
      leaveBalance: {
        annual: 20,
        sick: 10,
        emergency: 5,
      },
      timeRecords: [
        {
          date: "2023-06-01",
          clockIn: "07:55:22",
          clockOut: "17:15:44",
          totalHours: "9:20:22",
          status: "present",
          remarks: "",
        },
        {
          date: "2023-06-02",
          clockIn: "07:50:11",
          clockOut: "17:10:33",
          totalHours: "9:20:22",
          status: "present",
          remarks: "",
        },
      ],
      leaveRequests: [],
      scheduleChanges: [],
      officialBusinessRequests: [],
    },
    {
      id: "5",
      employeeId: "EMP005",
      name: "Carlos Mendoza",
      email: "carlos.mendoza@sdca.edu.ph",
      phone: "+63 956 789 0123",
      position: "Accountant",
      department: "Finance",
      status: "active",
      hireDate: "2020-01-15",
      employmentType: "Full-time",
      manager: "Isabella Cruz",
      avatar: "/placeholder.svg?height=100&width=100",
      leaveBalance: {
        annual: 15,
        sick: 10,
        emergency: 5,
      },
      timeRecords: [
        {
          date: "2023-06-01",
          clockIn: "08:10:33",
          clockOut: "17:05:44",
          totalHours: "8:55:11",
          status: "present",
          remarks: "",
        },
        {
          date: "2023-06-02",
          clockIn: "08:20:55",
          clockOut: "17:10:22",
          totalHours: "8:49:27",
          status: "late",
          remarks: "Traffic",
        },
      ],
      leaveRequests: [],
      scheduleChanges: [
        {
          id: "SC002",
          employeeName: "Carlos Mendoza",
          date: "2023-06-25",
          currentSchedule: "8:00 AM - 5:00 PM",
          requestedSchedule: "9:00 AM - 6:00 PM",
          reason: "Personal errand in the morning",
          status: "pending",
          appliedOn: "2023-06-15",
        },
      ],
      officialBusinessRequests: [],
    },
    {
      id: "6",
      employeeId: "EMP006",
      name: "Isabella Cruz",
      email: "isabella.cruz@sdca.edu.ph",
      phone: "+63 967 890 1234",
      position: "Finance Manager",
      department: "Finance",
      status: "active",
      hireDate: "2016-09-12",
      employmentType: "Full-time",
      avatar: "/placeholder.svg?height=100&width=100",
      leaveBalance: {
        annual: 22,
        sick: 10,
        emergency: 5,
      },
      timeRecords: [
        {
          date: "2023-06-01",
          clockIn: "07:45:22",
          clockOut: "17:30:44",
          totalHours: "9:45:22",
          status: "present",
          remarks: "",
        },
        {
          date: "2023-06-02",
          clockIn: "07:50:11",
          clockOut: "17:25:33",
          totalHours: "9:35:22",
          status: "present",
          remarks: "",
        },
      ],
      leaveRequests: [],
      scheduleChanges: [],
      officialBusinessRequests: [
        {
          id: "OB002",
          employeeName: "Isabella Cruz",
          date: "2023-06-28",
          startTime: "09:00",
          endTime: "17:00",
          purpose: "Attend financial seminar",
          status: "pending",
          appliedOn: "2023-06-14",
        },
      ],
    },
    {
      id: "7",
      employeeId: "EMP007",
      name: "Rafael Lim",
      email: "rafael.lim@sdca.edu.ph",
      phone: "+63 978 901 2345",
      position: "Marketing Specialist",
      department: "Marketing",
      status: "active",
      hireDate: "2021-02-10",
      employmentType: "Full-time",
      manager: "Sofia Garcia",
      avatar: "/placeholder.svg?height=100&width=100",
      leaveBalance: {
        annual: 10,
        sick: 10,
        emergency: 5,
      },
      timeRecords: [
        {
          date: "2023-06-01",
          clockIn: "08:05:33",
          clockOut: "17:10:44",
          totalHours: "9:05:11",
          status: "present",
          remarks: "",
        },
        {
          date: "2023-06-02",
          clockIn: "08:00:22",
          clockOut: "17:05:33",
          totalHours: "9:05:11",
          status: "present",
          remarks: "",
        },
      ],
      leaveRequests: [
        {
          id: "L003",
          employeeName: "Rafael Lim",
          type: "Emergency",
          startDate: "2023-06-18",
          endDate: "2023-06-18",
          days: 1,
          reason: "Family emergency",
          status: "pending",
          appliedOn: "2023-06-16",
        },
      ],
      scheduleChanges: [],
      officialBusinessRequests: [],
    },
    {
      id: "8",
      employeeId: "EMP008",
      name: "Sofia Garcia",
      email: "sofia.garcia@sdca.edu.ph",
      phone: "+63 989 012 3456",
      position: "Marketing Manager",
      department: "Marketing",
      status: "active",
      hireDate: "2018-07-20",
      employmentType: "Full-time",
      avatar: "/placeholder.svg?height=100&width=100",
      leaveBalance: {
        annual: 18,
        sick: 10,
        emergency: 5,
      },
      timeRecords: [
        {
          date: "2023-06-01",
          clockIn: "07:50:22",
          clockOut: "17:20:44",
          totalHours: "9:30:22",
          status: "present",
          remarks: "",
        },
        {
          date: "2023-06-02",
          clockIn: "07:55:11",
          clockOut: "17:15:33",
          totalHours: "9:20:22",
          status: "present",
          remarks: "",
        },
      ],
      leaveRequests: [],
      scheduleChanges: [],
      officialBusinessRequests: [],
    },
    {
      id: "9",
      employeeId: "EMP009",
      name: "Miguel Torres",
      email: "miguel.torres@sdca.edu.ph",
      phone: "+63 990 123 4567",
      position: "Operations Coordinator",
      department: "Operations",
      status: "active",
      hireDate: "2019-11-15",
      employmentType: "Full-time",
      manager: "Camila Reyes",
      avatar: "/placeholder.svg?height=100&width=100",
      leaveBalance: {
        annual: 14,
        sick: 10,
        emergency: 5,
      },
      timeRecords: [
        {
          date: "2023-06-01",
          clockIn: "08:00:33",
          clockOut: "17:00:44",
          totalHours: "9:00:11",
          status: "present",
          remarks: "",
        },
        {
          date: "2023-06-02",
          clockIn: "08:05:22",
          clockOut: "17:05:33",
          totalHours: "9:00:11",
          status: "present",
          remarks: "",
        },
      ],
      leaveRequests: [],
      scheduleChanges: [
        {
          id: "SC003",
          employeeName: "Miguel Torres",
          date: "2023-06-30",
          currentSchedule: "8:00 AM - 5:00 PM",
          requestedSchedule: "7:00 AM - 4:00 PM",
          reason: "Need to pick up child from school",
          status: "pending",
          appliedOn: "2023-06-15",
        },
      ],
      officialBusinessRequests: [],
    },
    {
      id: "10",
      employeeId: "EMP010",
      name: "Camila Reyes",
      email: "camila.reyes@sdca.edu.ph",
      phone: "+63 901 234 5678",
      position: "Operations Manager",
      department: "Operations",
      status: "active",
      hireDate: "2017-03-05",
      employmentType: "Full-time",
      avatar: "/placeholder.svg?height=100&width=100",
      leaveBalance: {
        annual: 20,
        sick: 10,
        emergency: 5,
      },
      timeRecords: [
        {
          date: "2023-06-01",
          clockIn: "07:45:33",
          clockOut: "17:30:44",
          totalHours: "9:45:11",
          status: "present",
          remarks: "",
        },
        {
          date: "2023-06-02",
          clockIn: "07:50:22",
          clockOut: "17:25:33",
          totalHours: "9:35:11",
          status: "present",
          remarks: "",
        },
      ],
      leaveRequests: [],
      scheduleChanges: [],
      officialBusinessRequests: [
        {
          id: "OB003",
          employeeName: "Camila Reyes",
          date: "2023-06-25",
          startTime: "10:00",
          endTime: "16:00",
          purpose: "Visit warehouse for inventory check",
          status: "pending",
          appliedOn: "2023-06-15",
        },
      ],
    },
  ]
  
  