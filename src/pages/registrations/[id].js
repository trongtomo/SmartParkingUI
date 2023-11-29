import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

const RegistrationDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://server.smartparking.site/api/admin/registrations/${registrationId}`,
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6NCwidXNlcm5hbWUiOiIwOTA2NjExNDEyIiwiY3JlYXRlZEF0IjoiMjAyMy0xMS0yOVQwNDozNjo0Ny45MThaIn0sImlhdCI6MTcwMTIzMjYwN30.DpbRMxo6_v931LjfYZ6XlFFGxT2-n9oPGmgZeORC1dM`,
            },
          }
        );

        if (response.data.code === 200) {
          setRegistration(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching registration data:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (!registration) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Registration Details</h1>
      <p>Registration ID: {registration.registrationId}</p>
      <p>Status: {registration.registrationStatus}</p>
      <p>Amount: {registration.amount}</p>
      <p>Approved By: {registration.approvedBy}</p>
      <p>Expired Date: {registration.expiredDate}</p>

      {/* Assuming 'faceImage' is a URL, display it as an image */}
      {registration.faceImage && (
        <img src={registration.faceImage} alt="Face Image" style={{ maxWidth: "100%" }} />
      )}

      {/* Display other properties as needed */}
      <p>Plate Number: {registration.plateNumber}</p>
      <p>Has Payment: {registration.hasPayment}</p>
      <p>Model: {registration.model}</p>
      <p>Registration Number: {registration.registrationNumber}</p>
      <p>Manufacture: {registration.manufacture}</p>
      <p>Gender: {registration.gender}</p>
      <p>Created At: {registration.createdAt}</p>
      <p>Updated At: {registration.updatedAt}</p>
      <p>User ID: {registration.userId}</p>
    </div>
  );
};
export default RegistrationDetailPage;
