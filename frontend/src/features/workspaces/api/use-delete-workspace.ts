import axios from "axios";
import { errorMonitor } from "events";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9090";

/**
 
 * @param {number} id - L'identifiant de l'organisation à supprimer.
 * @returns {Promise<boolean>} - Retourne `true` si succès, sinon `false`.
 */
export const deleteOrganization = async (id: number): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
      const url=`${BASE_URL}/organizations/${id}`;
    // const url=`${BASE_URL}/organizations/1`;
    const res = await axios.delete(url, {
      headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          } ,
    });
    if (res.status === 200) {
      toast.success(res.data.message || "Organisation supprimée avec succès");
      return res.data;
    }
  } catch (error) {
    return error.response || "Erreur lors de la suppression de l'organisation";
  }
};
