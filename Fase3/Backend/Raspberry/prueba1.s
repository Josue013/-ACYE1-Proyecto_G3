        .arch armv8-a
        .file   "prueba1.c"
        .text
        .section        .rodata.str1.8,"aMS",@progbits,1
        .align  3
.LC0:
        .string "r"
        .align  3
.LC1:
        .string "data.csv"
        .align  3
.LC2:
        .string "Error opening file"
        .align  3
.LC3:
        .string ","
        .align  3
.LC4:
        .string "Diferencia temperaturas maximas : %.2f\n"
        .align  3
.LC5:
        .string "Diferencia temperaturas minimas : %.2f\n"
        .align  3
.LC6:
        .string "w"
        .align  3
.LC7:
        .string "tmax.txt"
        .align  3
.LC8:
        .string "%.2f\n"
        .align  3
.LC9:
        .string "tmin.txt"
        .section        .text.startup,"ax",@progbits
        .align  2
        .p2align 4,,11
        .global main
        .type   main, %function
main:
.LFB22:
        .cfi_startproc
        stp     x29, x30, [sp, -336]!
        .cfi_def_cfa_offset 336
        .cfi_offset 29, -336
        .cfi_offset 30, -328
        adrp    x1, .LC0
        adrp    x0, .LC1
        mov     x29, sp
        add     x1, x1, :lo12:.LC0
        add     x0, x0, :lo12:.LC1
        bl      fopen
        cbz     x0, .L24
        stp     x19, x20, [sp, 16]
        .cfi_offset 20, -312
        .cfi_offset 19, -320
        add     x20, sp, 80
        mov     x2, x0
        mov     w1, 256
        str     x21, [sp, 32]
        .cfi_offset 21, -304
        mov     x21, x0
        mov     x0, x20
        str     d12, [sp, 40]
        .cfi_offset 76, -296
        adrp    x19, .LC3
        stp     d8, d9, [sp, 48]
        .cfi_offset 73, -280
        .cfi_offset 72, -288
        add     x19, x19, :lo12:.LC3
        stp     d10, d11, [sp, 64]
        .cfi_offset 75, -264
        .cfi_offset 74, -272
        bl      fgets
        mov     x0, 61572651155456
        mov     x1, 61572651155456
        movk    x0, 0x408f, lsl 48
        movk    x1, 0xc08f, lsl 48
        fmov    d9, x0
        fmov    d10, x1
        fmov    d11, d9
        fmov    d12, d10
        .p2align 3,,7
.L4:
        mov     x2, x21
        mov     x0, x20
        mov     w1, 256
        bl      fgets
        cbz     x0, .L25
.L9:
        mov     x1, x19
        mov     x0, x20
        bl      strtok
        mov     x1, x19
        mov     x0, 0
        bl      strtok
        mov     x1, 0
        bl      strtod
        fmov    d8, d0
        mov     x1, x19
        mov     x0, 0
        bl      strtok
        mov     x1, 0
        bl      strtod
        fcmpe   d8, d12
        bgt     .L12
.L5:
        fcmpe   d0, d10
        bgt     .L13
.L6:
        fcmpe   d11, d8
        bgt     .L14
.L7:
        fcmpe   d0, d9
        bmi     .L15
        mov     x2, x21
        mov     x0, x20
        mov     w1, 256
        bl      fgets
        cbnz    x0, .L9
.L25:
        fabd    d10, d10, d12
        adrp    x0, .LC4
        add     x0, x0, :lo12:.LC4
        adrp    x20, .LC6
        fmov    d0, d10
        bl      printf
        fabd    d9, d9, d11
        adrp    x0, .LC5
        add     x0, x0, :lo12:.LC5
        fmov    d0, d9
        bl      printf
        add     x1, x20, :lo12:.LC6
        adrp    x0, .LC7
        add     x0, x0, :lo12:.LC7
        bl      fopen
        mov     x19, x0
        cbz     x0, .L10
        fmov    d0, d10
        adrp    x1, .LC8
        add     x1, x1, :lo12:.LC8
        bl      fprintf
        mov     x0, x19
        bl      fclose
.L10:
        add     x1, x20, :lo12:.LC6
        adrp    x0, .LC9
        add     x0, x0, :lo12:.LC9
        bl      fopen
        mov     x19, x0
        cbz     x0, .L11
        fmov    d0, d9
        adrp    x1, .LC8
        add     x1, x1, :lo12:.LC8
        bl      fprintf
        mov     x0, x19
        bl      fclose
        bl      exit
.L11:
        mov     x0, x21
        bl      fclose
        ldp     x19, x20, [sp, 16]
        .cfi_restore 20
        .cfi_restore 19
        mov     w0, 0
        ldr     x21, [sp, 32]
        .cfi_restore 21
        ldp     d8, d9, [sp, 48]
        .cfi_restore 73
        .cfi_restore 72
        ldp     d10, d11, [sp, 64]
        .cfi_restore 75
        .cfi_restore 74
        ldr     d12, [sp, 40]
        .cfi_restore 76
.L1:
        ldp     x29, x30, [sp], 336
        .cfi_restore 30
        .cfi_restore 29
        .cfi_def_cfa_offset 0
        ret
        .p2align 2,,3
.L15:
        .cfi_def_cfa_offset 336
        .cfi_offset 19, -320
        .cfi_offset 20, -312
        .cfi_offset 21, -304
        .cfi_offset 29, -336
        .cfi_offset 30, -328
        .cfi_offset 72, -288
        .cfi_offset 73, -280
        .cfi_offset 74, -272
        .cfi_offset 75, -264
        .cfi_offset 76, -296
        fmov    d9, d0
        b       .L4
        .p2align 2,,3
.L14:
        fmov    d11, d8
        b       .L7
        .p2align 2,,3
.L13:
        fmov    d10, d0
        b       .L6
        .p2align 2,,3
.L12:
        fmov    d12, d8
        b       .L5
.L24:
        .cfi_restore 19
        .cfi_restore 20
        .cfi_restore 21
        .cfi_restore 72
        .cfi_restore 73
        .cfi_restore 74
        .cfi_restore 75
        .cfi_restore 76
        adrp    x0, .LC2
        add     x0, x0, :lo12:.LC2
        bl      puts
        mov     w0, 1
        b       .L1
        .cfi_endproc
.LFE22:
        .size   main, .-main
        .ident  "GCC: (Debian 12.2.0-14) 12.2.0"
        .section        .note.GNU-stack,"",@progbits