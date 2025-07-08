<h1 align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&duration=3000&pause=1000&color=FF0055&center=true&vCenter=true&width=435&lines=Rhein+Sakatoku;true+hacker;cyberpsycho+mode+%F0%9F%92%80" alt="Typing SVG" />
</h1>


<p align="center">
  <a href="https://rheinsakatoku.github.io" target="_blank">
    <img src="https://komarev.com/ghpvc/?username=RheinSakatoku&style=flat-square&color=ff0066&label=cyber%20scans" />
  </a>
  <a href="https://rheinsakatoku.github.io" target="_blank">
    <img src="https://img.shields.io/badge/%20status-CYBERACTIVE-%23ff0066?style=flat-square&logo=codersrank&logoColor=white" />
  </a>
  <a href="https://rheinsakatoku.github.io" target="_blank">
    <img src="https://img.shields.io/badge/%20brainmode-unstable%20-%23ff0033?style=flat-square&logo=probot&logoColor=white" />
  </a>
</p>



---

### 🧠 Profile Boot Sequence:

```bash
#!/bin/bash

# === CONFIG ===
DISK="/dev/sda"     
HOSTNAME="Arch"
USERNAME="Rhein"
PASSWORD="********"

# Очистка диска и создание разделов
sgdisk --zap-all "$DISK"

parted "$DISK" --script mklabel gpt \
  mkpart primary fat32 1MiB 513MiB \
  set 1 esp on \
  mkpart primary linux-swap 513MiB 2561MiB \
  mkpart primary ext4 2561MiB 22561MiB \
  mkpart primary ext4 22561MiB 100%

BOOT="${DISK}1"
SWAP="${DISK}2"
ROOT="${DISK}3"
HOME="${DISK}4"

# Форматирование
mkfs.fat -F32 "$BOOT"
mkswap "$SWAP"
mkfs.ext4 "$ROOT"
mkfs.ext4 "$HOME"

# Монтирование
mount "$ROOT" /mnt
mkdir /mnt/boot
mkdir /mnt/home
mount "$BOOT" /mnt/boot
mount "$HOME" /mnt/home
swapon "$SWAP"

# Базовая установка
pacstrap /mnt base linux linux-firmware vim networkmanager gnome gnome-tweaks gdm xorg

genfstab -U /mnt >> /mnt/etc/fstab

# Конфигурация в chroot
arch-chroot /mnt /bin/bash <<EOF

echo "$HOSTNAME" > /etc/hostname

ln -sf /usr/share/zoneinfo/Europe/Moscow /etc/localtime
hwclock --systohc

# Локаль и язык
echo "ru_RU.UTF-8 UTF-8" > /etc/locale.gen
echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen
locale-gen

echo "LANG=ru_RU.UTF-8" > /etc/locale.conf
echo "KEYMAP=ru" > /etc/vconsole.conf

# Таймсинхронизация
timedatectl set-ntp true
systemctl enable systemd-timesyncd

# root-пароль
echo "root:$PASSWORD" | chpasswd

# Пользователь
useradd -m -G wheel -s /bin/bash $USERNAME
echo "$USERNAME:$PASSWORD" | chpasswd
echo "%wheel ALL=(ALL:ALL) ALL" >> /etc/sudoers

# Сетевой менеджер
systemctl enable NetworkManager

# Gnome
systemctl enable gdm

# systemd-boot
bootctl install

PARTUUID=\$(blkid -s PARTUUID -o value $ROOT)

cat <<ELOADER > /boot/loader/loader.conf
default arch
timeout 3
editor no
ELOADER

cat <<EENTRY > /boot/loader/entries/arch.conf
title   Arch Linux
linux   /vmlinuz-linux
initrd  /initramfs-linux.img
options root=PARTUUID=$PARTUUID rw
EENTRY

EOF

echo "Установка завершена. Перезагрузите систему."

