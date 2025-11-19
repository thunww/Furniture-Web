import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { FaBars } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { Store } from "lucide-react";

import CategoryPanel from "./CategoryPanel";
import "../Navigation/style.css";

/**
 * ====== DỮ LIỆU: dùng category_id thống nhất ======
 * Map ID theo DB thực tế của bạn (giống với CategoryPanel.jsx)
 */
const PRODUCTS_COLS = [
  {
    heading: "Phòng khách",
    items: [
      { id: 1, label: "Sofa & Armchair" },
      { id: 2, label: "Bàn trà" },
      { id: 3, label: "Bàn góc" },
      { id: 4, label: "Kệ / Bàn TV" },
    ],
  },
  {
    heading: "Phòng ăn",
    items: [
      { id: 5, label: "Bàn ăn" },
      { id: 6, label: "Ghế ăn" },
      { id: 7, label: "Ghế bar" },
    ],
  },
  {
    heading: "Phòng ngủ",
    items: [
      { id: 8, label: "Giường ngủ" },
      { id: 9, label: "Tủ áo" },
      { id: 10, label: "Táp đầu giường" },
      { id: 11, label: "Nệm" },
      { id: 12, label: "Bàn trang điểm" },
    ],
  },
  {
    heading: "Làm việc & Lưu trữ",
    items: [
      { id: 30, label: "Bàn làm việc" },
      { id: 31, label: "Ghế công thái học" },
      { id: 13, label: "Kệ sách" },
      { id: 15, label: "Tủ / Kệ đa năng" },
    ],
  },
  {
    heading: "Trang trí",
    items: [
      { id: 16, label: "Đèn trang trí" },
      { id: 20, label: "Gương" },
      { id: 19, label: "Tranh treo" },
      { id: 21, label: "Bình / Lọ" },
      { id: 24, label: "Tượng / Khung hình" },
      { id: 26, label: "Gối & Thảm" },
      { id: 27, label: "Nến & phụ kiện" },
    ],
  },
];

// (Tùy chọn) Menu phòng – nếu sau này cần thì dùng
const ROOMS = [
  { label: "Phòng khách", categoryId: 1 },
  { label: "Phòng ăn", categoryId: 2 },
  { label: "Phòng ngủ", categoryId: 3 },
  { label: "Phòng làm việc", categoryId: 30 },
  { label: "Phòng bếp", categoryId: 5 },
  { label: "Ngoại thất", categoryId: 28 },
];

// Các mục chữ thêm cho thanh giữa, giống Nhà Xinh
const NAV_EXTRA_ITEMS = [
  { label: "PHÒNG", to: "/rooms" },
  { label: "BỘ SƯU TẬP", to: "/collections" },
  { label: "THIẾT KẾ NỘI THẤT", to: "/design-service" },
  { label: "GÓC CẢM HỨNG", to: "/inspiration" },
];

const Navigation = () => {
  const [isOpenCatPanel, setIsOpenCatPanel] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  const openCategoryPanel = () => setIsOpenCatPanel(true);

  // Dùng category_id để điều hướng (đồng bộ với Drawer)
  const handleGoCategoryById = (id) => {
    if (!id) return;
    navigate(`/search?category_id=${id}`);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="relative border-b border-gray-200 bg-white">
        {/* ===== Desktop ===== */}
        <div className="container px-4 sm:px-6 hidden md:flex items-center justify-between">
          {/* Trái: nút mở drawer danh mục tổng */}
          <Button
            className="!text-black flex items-center gap-2 !py-3"
            onClick={openCategoryPanel}
          >
            <HiOutlineMenuAlt1 className="text-[18px]" />
            <span className="truncate text-sm">Danh mục nội thất</span>
          </Button>

          {/* Giữa: SẢN PHẨM + các mục chữ thêm */}
          <ul className="flex items-center gap-8">
            {/* Mục SẢN PHẨM có mega menu */}
            <li className="relative group">
              <button className="text-[16px] font-semibold tracking-wide hover:text-amber-700 flex items-center gap-1">
                SẢN PHẨM <span className="text-amber-600">▾</span>
              </button>

              {/* Mega menu Sản phẩm */}
              <div className="megaMenu absolute left-0 top-full w-[min(1100px,92vw)] bg-white shadow-xl border z-[60] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 p-6">
                  {PRODUCTS_COLS.map((col) => (
                    <div key={col.heading}>
                      <h4 className="text-[15px] font-semibold mb-2">
                        {col.heading}
                      </h4>
                      <ul className="space-y-2">
                        {col.items.map((it) => (
                          <li key={it.id}>
                            <button
                              type="button"
                              onClick={() => handleGoCategoryById(it.id)}
                              className="text-[14px] text-gray-700 hover:text-amber-700"
                            >
                              {it.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </li>

            {/* Các mục chữ thêm giống thanh menu Nhà Xinh */}
            {NAV_EXTRA_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="text-[15px] font-medium text-gray-800 hover:text-amber-700 transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Phải: Go Shipper + Become a Vendor */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/shipper/register" className="nav-link">

              <span></span>
            </Link>
            <Link to="/register-vendor" className="nav-link">

              <span></span>
            </Link>
          </div>
        </div>

        {/* ===== Mobile ===== */}
        <div
          className="md:hidden container px-4 py-2 flex items-center justify-between"
          ref={mobileMenuRef}
        >
          <Button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <FaBars className="text-lg" />
          </Button>

          <Button onClick={openCategoryPanel} className="flex items-center gap-1">
            <HiOutlineMenuAlt1 className="text-lg" />
            <span className="text-xs">Danh mục</span>
          </Button>

          {isMobileMenuOpen && (
            <div className="mobileMenu bg-white shadow-xl border absolute left-0 top-full w-full z-[70] max-h-[70vh] overflow-auto">
              {/* Nhóm lớn: SẢN PHẨM */}
              <details open className="border-b">
                <summary className="py-3 px-4 text-sm font-semibold">
                  SẢN PHẨM
                </summary>
                {PRODUCTS_COLS.map((col) => (
                  <details key={col.heading} className="border-t">
                    <summary className="py-2 px-5 text-sm font-medium">
                      {col.heading}
                    </summary>
                    <ul className="pl-8 pb-3 space-y-2">
                      {col.items.map((it) => (
                        <li key={it.id}>
                          <button
                            type="button"
                            onClick={() => {
                              handleGoCategoryById(it.id);
                              setIsMobileMenuOpen(false);
                            }}
                            className="text-sm block text-left w-full py-1 hover:text-amber-700"
                          >
                            {it.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </details>

              {/* Các mục chữ thêm ở mobile */}
              <div className="border-t px-4 py-3 space-y-1 text-sm">
                {NAV_EXTRA_ITEMS.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      navigate(item.to);
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-1 hover:text-amber-700"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex justify-between px-4 py-3 text-sm border-t">
                <Link to="/shipper/register">Go Shipper</Link>
                <Link to="/register-vendor">Become a Vendor</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Drawer danh mục tổng */}
      <CategoryPanel
        isOpenCatPanel={isOpenCatPanel}
        setIsOpenCatPanel={setIsOpenCatPanel}
      />
    </>
  );
};

export default Navigation;
