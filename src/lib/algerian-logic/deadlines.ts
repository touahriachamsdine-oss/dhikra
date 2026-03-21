export function calculateFormalNoticeDeadline(startDate: Date): Date {
    const deadline = new Date(startDate);
    deadline.setDate(deadline.getDate() + 15);
    return deadline;
}

export function calculatePaymentInjunctionDeadline(startDate: Date): Date {
    const deadline = new Date(startDate);
    deadline.setDate(deadline.getDate() + 15);
    return deadline;
}

export function getLaborDisputeConciliationWaitDays(): number {
    return 14;
}
