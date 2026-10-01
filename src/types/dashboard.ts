export interface DashboardStat {
  label: string;
  value: number;
  description: string;
}

export interface DonorDashboardData {
  totalResponses: number;
  acceptedResponses: number;
  completedDonations: number;
}


export interface RequesterDashboardData {
  totalRequests: number;
  pendingRequests: number;
  fulfilledRequests: number;
}



export interface AdminDashboardData {
  users: {
    total: number;
    donors: number;
    requesters: number;
  };
  bloodRequests: {
    total: number;
    pending: number;
  };
  donations: {
    total: number;
    completed: number;
    verified: number;
  };
  payments: {
    total: number;
    paid: number;
    pending: number;
    paidAmount: number;
    currency: string;
  };
}




