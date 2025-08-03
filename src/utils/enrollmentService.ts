// Servicio para operaciones de enrollment
export const updateEnrollmentStatus = async (status: string): Promise<any> => {
  try {
    const enrollmentStr = localStorage.getItem('enrollment') || localStorage.getItem('currentEnrollment');
    if (!enrollmentStr) {
      console.warn('No enrollment found in localStorage');
      return null;
    }

    const enrollment = JSON.parse(enrollmentStr);
    
    // Solo actualizar si el status no es ya igual o superior al requerido
    const currentStatus = parseInt(enrollment.status);
    const targetStatus = parseInt(status);
    
    if (currentStatus >= targetStatus) {
      console.log(`Enrollment status is already ${currentStatus} or higher, skipping update to ${status}`);
      return enrollment;
    }

    const response = await fetch(`http://localhost:8080/enrollments/${enrollment.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        status: status,
        payment: {
          id: enrollment.payment.id
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Error updating enrollment status: ${response.status}`);
    }

    const updatedEnrollment = await response.json();
    
    // Actualizar el enrollment en localStorage
    localStorage.setItem('enrollment', JSON.stringify(updatedEnrollment));
    localStorage.setItem('currentEnrollment', JSON.stringify(updatedEnrollment));
    
    console.log(`Enrollment status updated to "${status}" successfully`);
    
    return updatedEnrollment;
  } catch (error) {
    console.error(`Error updating enrollment status to "${status}":`, error);
    throw error;
  }
};
