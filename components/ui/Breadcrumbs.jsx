import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { menuItems } from "@/constant/data";
import Icon from "@/components/ui/Icon";

const Breadcrumbs = () => {
  const location = usePathname();
  const locationName = location.replace("/", "");

  const [isHide, setIsHide] = useState(null);
  const [groupTitle, setGroupTitle] = useState("");
  const [groupIcon, setGroupIcon] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  const [analyticsIcon, setAnalyticsIcon] = useState("heroicons-outline:home"); // Icône par défaut
  const [analyticsTitle, setAnalyticsTitle] = useState(""); // Titre dynamique

  useEffect(() => {
    const currentMenuItem = menuItems.find((item) => item.link === locationName);

    const currentChild = menuItems.find((item) =>
      item.child?.find((child) => child.childlink === locationName)
    );

    // Trouver l'élément `isHeadr` correspondant
    const relevantHeadr = menuItems
      .slice(0, menuItems.findIndex((item) => item.link === locationName) + 1)
      .reverse()
      .find((item) => item.isHeadr);

    if (relevantHeadr) {
      // Définir l'icône et le titre dynamiquement selon `relevantHeadr.title`
      if (relevantHeadr.title === "menu") {
        setAnalyticsIcon("heroicons-outline:menu");
        setAnalyticsTitle("Menu");
      } else if (relevantHeadr.title === "Paramètre") {
        setAnalyticsIcon("heroicons-outline:cog");
        setAnalyticsTitle("Paramètre");
      } else if (relevantHeadr.title === "Page") {
        setAnalyticsIcon("foundation:page-filled");
        setAnalyticsTitle("Pages");
      }  else {
        setAnalyticsIcon("heroicons-outline:home"); // Icône par défaut
        setAnalyticsTitle(relevantHeadr.title || "Accueil");
      }
    }

    if (currentMenuItem) {
      setIsHide(currentMenuItem.isHide);
      setPageTitle(currentMenuItem.title);
      setGroupIcon(currentMenuItem.icon);
    } else if (currentChild) {
      setIsHide(currentChild?.isHide || false);
      setGroupTitle(currentChild?.title);
      setGroupIcon(currentChild?.icon);
      setPageTitle(
        currentChild.child.find((child) => child.childlink === locationName)
          ?.title || ""
      );
    }
  }, [location, locationName]);

  return (
    <div className="md:mb-6 mb-4 flex space-x-3 rtl:space-x-reverse">
      <ul className="breadcrumbs">
        <li className="text-primary-500 flex items-center space-x-2">
          <Link href="/analytics" className="text-lg flex items-center space-x-2">
            <Icon icon={analyticsIcon} />
            <span>{analyticsTitle}</span>
          </Link>
          <span className="breadcrumbs-icon rtl:transform rtl:rotate-180">
            <Icon icon="heroicons:chevron-right" />
          </span>
        </li>
        {groupTitle && (
          <li className="text-primary-500 flex items-center space-x-2">
            <Icon icon={groupIcon} />
            <span>{groupTitle}</span>
            <span className="breadcrumbs-icon rtl:transform rtl:rotate-180">
              <Icon icon="heroicons:chevron-right" />
            </span>
          </li>
        )}
        <li className="text-primary-500 flex items-center space-x-2">
          <Icon icon={groupIcon} />
          <span>{pageTitle}</span>
        </li>
      </ul>
    </div>
  );
};

export default Breadcrumbs;
