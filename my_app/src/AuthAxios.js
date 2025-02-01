import axios from "axios";

const token = localStorage.getItem("token");

const AuthAxios = axios.create({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default AuthAxios;
