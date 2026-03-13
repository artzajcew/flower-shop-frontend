import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  getOrders, 
  getOrder, 
  createOrder as apiCreateOrder,
  updateOrderStatus as apiUpdateStatus,
  searchOrders as apiSearchOrders
} from '../api/api';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Загружаем заказы (для админа)
  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      setOrders(response.data);
    } catch (err) {
      console.error('Ошибка загрузки заказов:', err);
    } finally {
      setLoading(false);
    }
  };

  // Создание нового заказа
  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      const response = await apiCreateOrder(orderData);
      return response.data.id;
    } catch (err) {
      console.error('Ошибка создания заказа:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Обновление статуса заказа (админ)
  const updateOrderStatus = async (orderId, newStatus, comment = '') => {
    try {
      setLoading(true);
      await apiUpdateStatus(orderId, newStatus, comment);
      await loadOrders(); // перезагружаем список
    } catch (err) {
      console.error('Ошибка обновления статуса:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Получение заказа по ID
  const getOrderById = async (orderId) => {
    try {
      const response = await getOrder(orderId);
      return response.data;
    } catch (err) {
      console.error('Ошибка получения заказа:', err);
      throw err;
    }
  };

  // Поиск заказов пользователя
  const searchUserOrders = async (email, phone) => {
    try {
      const response = await apiSearchOrders(email, phone);
      return response.data;
    } catch (err) {
      console.error('Ошибка поиска заказов:', err);
      throw err;
    }
  };

  return (
    <OrderContext.Provider value={{
      orders,
      loading,
      loadOrders,
      createOrder,
      updateOrderStatus,
      getOrderById,
      searchUserOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}